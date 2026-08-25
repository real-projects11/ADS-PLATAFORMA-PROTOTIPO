import { sql, getUserId, ensureSchema } from '../../../lib/server';

export default async function handler(req, res) {
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });
  try {
    await ensureSchema();
    const userResult = await sql`SELECT id, username, points FROM users WHERE id = ${uid}`;
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ error: 'No autenticado.' });
    const tx = await sql`
      SELECT id, delta, reason, created_at
      FROM point_transactions
      WHERE user_id = ${uid}
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return res.status(200).json({ user, transactions: tx.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
