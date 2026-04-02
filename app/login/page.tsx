'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full" style={{ maxWidth: '400px' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FFC107', borderRadius: '4px' }}>
            <span className="font-bold text-sm" style={{ color: '#1A1C1C' }}>H</span>
          </div>
          <div>
            <div className="font-semibold" style={{ color: '#1A1C1C', fontSize: '15px', letterSpacing: '-0.01em' }}>HatSafe</div>
            <div className="label-sm" style={{ fontSize: '9px' }}>COMPLIANCE PLATFORM</div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>Sign in</h1>
          <p className="mt-1" style={{ color: '#474747' }}>Access your compliance dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="px-4 py-3 text-sm" style={{
              backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '4px',
              fontWeight: 500, letterSpacing: '0.01em',
            }}>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-xs" style={{ color: '#474747' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ padding: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: '#A3A3A3' }}>
          No account?{' '}
          <Link href="/signup" style={{ color: '#1A1C1C', fontWeight: 500 }}>
            Start free trial →
          </Link>
        </p>

      </div>
    </div>
  );
}
