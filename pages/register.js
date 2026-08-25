import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.query.ref) setRef(router.query.ref);
  }, [router.query.ref]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, ref }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrarse.');
        setLoading(false);
        return;
      }
      router.replace('/dashboard');
    } catch {
      setError('Error de conexión.');
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Crear cuenta</h1>
      {ref && <p className="ref-note">Te invitó el usuario #{ref} 🎉</p>}
      <form onSubmit={handleSubmit} className="card">
        <label>Usuario</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
      </form>
      <p>¿Ya tenés cuenta? <Link href="/login">Iniciá sesión</Link></p>
    </div>
  );
}
