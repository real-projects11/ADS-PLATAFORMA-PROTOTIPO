import { sql, hashPassword, setSessionCookie, ensureSchema } from '../../../lib/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { username, password } = req.body || {};
  if (!username || !password || username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: 'Usuario mínimo 3 caracteres y contraseña mínimo 6.' });
  }
  try {
    await ensureSchema();
    const existing = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ese usuario ya existe.' });
    }
    const hash = await hashPassword(password);
    const result = await sql`
      INSERT INTO users (username, password_hash, points)
      VALUES (${username}, ${hash}, 0)
      RETURNING id, username, points
    `;
    const user = result.rows[0];
    setSessionCookie(res, user.id);
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
