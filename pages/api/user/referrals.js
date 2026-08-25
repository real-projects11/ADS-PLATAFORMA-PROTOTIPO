import { sql, getUserId, ensureSchema } from '../../../lib/server';

export default async function handler(req, res) {
  const uid = getUserId(req);
  if (!uid) return res.status(401).json({ error: 'No autenticado.' });
  try {
    await ensureSchema();

    const invited = await sql`
      SELECT u.id, u.username, u.created_at,
        EXISTS (
          SELECT 1 FROM ad_sessions a WHERE a.user_id = u.id AND a.status = 'claimed'
        ) AS active
      FROM users u
      WHERE u.referred_by = ${uid}
      ORDER BY u.created_at DESC
    `;

    const totalInvited = invited.rows.length;
    const totalActive = invited.rows.filter((r) => r.active).length;

    return res.status(200).json({
      referralId: uid,
      totalInvited,
      totalActive,
      totalInactive: totalInvited - totalActive,
      invited: invited.rows.map((r) => ({ username: r.username, active: r.active })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
