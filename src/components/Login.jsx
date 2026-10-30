import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Rabbit from './Rabbit';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw);
    } catch {
      setErr('Email or password is wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login">
      <Rabbit pose="idle" />
      <h1>BackRubbit</h1>
      <p>Sign in to see the bunny.</p>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <div className="err">{err}</div>}
        <button className="cta" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
