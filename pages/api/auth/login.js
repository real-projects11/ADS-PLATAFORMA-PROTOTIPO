import { sql, comparePassword, setSessionCookie, ensureSchema } from '../../../lib/server';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }
  try {
    await ensureSchema();
    const result = await sql`SELECT id, username, password_hash, points FROM users WHERE username = ${username}`;
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    setSessionCookie(res, user.id);
    return res.status(200).json({ user: { id: user.id, username: user.username, points: user.points } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
}
