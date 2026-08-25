import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const MIN_SECONDS = 15;

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adSessionId, setAdSessionId] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState('');
  const [redeemDesc, setRedeemDesc] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('');

  const loadUser = useCallback(async () => {
    const res = await fetch('/api/user/me');
    if (!res.ok) {
      router.replace('/login');
      return;
    }
    const data = await res.json();
    setUser(data.user);
    setTransactions(data.transactions);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  async function startAd() {
    setMessage('');
    const res = await fetch('/api/ad/start', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Error al iniciar el anuncio.');
      return;
    }
    setAdSessionId(data.adSessionId);
    setSecondsLeft(MIN_SECONDS);
  }

  async function claimAd() {
    if (!adSessionId) return;
    setMessage('');
    const res = await fetch('/api/ad/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adSessionId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'No se pudo reclamar.');
      return;
    }
    setMessage(`¡Ganaste ${data.pointsAwarded} puntos!`);
    setAdSessionId(null);
    loadUser();
  }

  async function handleRedeem(e) {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: redeemPoints, description: redeemDesc }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Error al canjear.');
      return;
    }
    setMessage('¡Canje realizado!');
    setRedeemDesc('');
    setRedeemPoints('');
    loadUser();
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  }

  if (loading) return <div className="container"><p>Cargando...</p></div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Hola, {user.username}</h1>
        <button onClick={handleLogout} className="secondary">Salir</button>
      </div>

      <div className="card">
        <p className="points">{user.points} puntos</p>

        {!adSessionId && <button onClick={startAd}>Ver anuncio</button>}

        {adSessionId && secondsLeft > 0 && <p>Mirando anuncio... {secondsLeft}s</p>}

        {adSessionId && secondsLeft <= 0 && <button onClick={claimAd}>Reclamar puntos</button>}

        {message && <p className="message">{message}</p>}
      </div>

      <div className="card">
        <h2>Canjear puntos</h2>
        <form onSubmit={handleRedeem}>
          <label>Puntos a canjear</label>
          <input type="number" min="1" value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} required />
          <label>Descripción del premio</label>
          <input value={redeemDesc} onChange={(e) => setRedeemDesc(e.target.value)} required />
          <button type="submit">Canjear</button>
        </form>
      </div>

      <div className="card">
        <h2>Historial</h2>
        <ul className="tx-list">
          {transactions.map((t) => (
            <li key={t.id} className={t.delta >= 0 ? 'positive' : 'negative'}>
              <span>{t.reason}</span>
              <span>{t.delta > 0 ? '+' : ''}{t.delta}</span>
            </li>
          ))}
          {transactions.length === 0 && <li>Sin movimientos todavía.</li>}
        </ul>
      </div>
    </div>
  );
}
