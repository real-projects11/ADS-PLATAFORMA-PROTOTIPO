import { sql, getUserId, ensureSchema } from '../../../lib/server';

const PERIODS = {
  today: "date_trunc('day', now())",
  week: "date_trunc('week', now())",
  month: "date_trunc('month', now())",
};

export default async function handler(req, res) {
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });

  const period = PERIODS[req.query.period] ? req.query.period : 'today';

  try {
    await ensureSchema();

    // Puntos ganados (solo deltas positivos) por usuario dentro del período
    const top = await sql.query(
      `
      SELECT u.id, u.username, COALESCE(SUM(pt.delta), 0)::int AS earned
      FROM users u
      JOIN point_transactions pt ON pt.user_id = u.id
        AND pt.delta > 0
        AND pt.created_at >= ${PERIODS[period]}
      GROUP BY u.id, u.username
      ORDER BY earned DESC, u.id ASC
      LIMIT 10
      `
    );

    const meRow = await sql.query(
      `
      SELECT COALESCE(SUM(pt.delta), 0)::int AS earned
      FROM point_transactions pt
      WHERE pt.user_id = $1 AND pt.delta > 0 AND pt.created_at >= ${PERIODS[period]}
      `,
      [uid]
    );
    const myEarned = meRow.rows[0]?.earned || 0;

    const rankRow = await sql.query(
      `
      SELECT count(*)::int + 1 AS rank
      FROM (
        SELECT pt.user_id, SUM(pt.delta) AS earned
        FROM point_transactions pt
        WHERE pt.delta > 0 AND pt.created_at >= ${PERIODS[period]}
        GROUP BY pt.user_id
        HAVING SUM(pt.delta) > $1
      ) t
      `,
      [myEarned]
    );

    return res.status(200).json({
      period,
      top: top.rows,
      me: { userId: uid, earned: myEarned, rank: rankRow.rows[0]?.rank || null },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
