import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => router.replace(res.ok ? '/dashboard' : '/login'))
      .catch(() => router.replace('/login'));
  }, [router]);
  return <div className="container"><p>Cargando...</p></div>;
}
