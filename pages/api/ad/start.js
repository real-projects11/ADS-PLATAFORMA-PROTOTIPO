import { sql, getUserId, ensureSchema } from '../../../lib/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });
  try {
    await ensureSchema();
    const result = await sql`
      INSERT INTO ad_sessions (user_id, status)
      VALUES (${uid}, 'started')
      RETURNING id, started_at
    `;
    const session = result.rows[0];
    return res.status(200).json({ adSessionId: session.id, startedAt: session.started_at, minSeconds: 15 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
