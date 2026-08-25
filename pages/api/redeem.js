import { sql, getUserId, ensureSchema } from '../../lib/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });
  const { points, description } = req.body || {};
  const pointsNum = parseInt(points, 10);
  if (!pointsNum || pointsNum <= 0 || !description) {
    return res.status(400).json({ error: 'Datos inválidos.' });
  }
  try {
    await ensureSchema();
    const updated = await sql`
      UPDATE users SET points = points - ${pointsNum}
      WHERE id = ${uid} AND points >= ${pointsNum}
      RETURNING points
    `;
    if (updated.rows.length === 0) {
      return res.status(400).json({ error: 'No tenés puntos suficientes.' });
    }
    await sql`
      INSERT INTO redemptions (user_id, points_spent, reward_description, status)
      VALUES (${uid}, ${pointsNum}, ${description}, 'pending')
    `;
    await sql`
      INSERT INTO point_transactions (user_id, delta, reason, ref_type)
      VALUES (${uid}, ${-pointsNum}, ${'Canje: ' + description}, 'redemption')
    `;
    return res.status(200).json({ ok: true, remainingPoints: updated.rows[0].points });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
