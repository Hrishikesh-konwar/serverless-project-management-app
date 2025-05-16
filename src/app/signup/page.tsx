'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://16ty7qdrel.execute-api.ap-south-1.amazonaws.com/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/api/auth/signin');
      } 
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-grey-800 to-indigo-900 text-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl bg-white/10 p-8 shadow-lg border border-black"
      >
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded p-2 text-black border border-black"
          />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded p-2 text-black border border-black"
          />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded p-2 text-black border border-black"
          />

        {/* <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded p-2 text-black"
        /> */}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-white/20 px-4 py-2 font-semibold hover:bg-white/30"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </main>
  );
}
