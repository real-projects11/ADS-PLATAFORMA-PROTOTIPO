import { sql, getUserId, ensureSchema } from '../../../lib/server';

const POINTS_PER_AD = 10;
const MIN_SECONDS = 15;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });
  const { adSessionId } = req.body || {};
  if (!adSessionId) return res.status(400).json({ error: 'Falta adSessionId.' });

  try {
    await ensureSchema();
    const claimResult = await sql`
      UPDATE ad_sessions
      SET status = 'claimed', claimed_at = now(), points_awarded = ${POINTS_PER_AD}
      WHERE id = ${adSessionId}
        AND user_id = ${uid}
        AND status = 'started'
        AND started_at <= now() - make_interval(secs => ${MIN_SECONDS})
      RETURNING id
    `;

    if (claimResult.rows.length === 0) {
      const check = await sql`
        SELECT status, extract(epoch from now() - started_at) AS elapsed
        FROM ad_sessions WHERE id = ${adSessionId} AND user_id = ${uid}
      `;
      const row = check.rows[0];
      if (!row) return res.status(404).json({ error: 'Sesión de anuncio no encontrada.' });
      if (row.status !== 'started') return res.status(400).json({ error: 'Este anuncio ya fue reclamado.' });
      const remaining = Math.max(0, MIN_SECONDS - Math.floor(row.elapsed));
      return res.status(400).json({ error: `Todavía faltan ${remaining}s para poder reclamar.` });
    }

    const updated = await sql`
      WITH ins AS (
        INSERT INTO point_transactions (user_id, delta, reason, ref_type, ref_id)
        VALUES (${uid}, ${POINTS_PER_AD}, 'Anuncio visto', 'ad_session', ${adSessionId})
        RETURNING user_id
      )
      UPDATE users u SET points = points + ${POINTS_PER_AD}
      FROM ins WHERE u.id = ins.user_id
      RETURNING u.points
    `;

    return res.status(200).json({ ok: true, pointsAwarded: POINTS_PER_AD, totalPoints: updated.rows[0].points });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
