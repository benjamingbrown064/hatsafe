'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', organisationName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(f => ({ ...f, [field]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return; }
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name, organisation_name: formData.organisationName } },
      });
      if (authError) { setError(authError.message); setLoading(false); return; }
      if (!authData.user) { setError('Failed to create user account'); setLoading(false); return; }
      const orgRes = await fetch('/api/auth/create-organisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: authData.user.id, organisation_name: formData.organisationName, user_name: formData.name }),
      });
      if (!orgRes.ok) { const d = await orgRes.json(); setError(d.error || 'Failed to create organisation'); setLoading(false); return; }
      router.push('/dashboard');
      router.refresh();
    } catch { setError('An unexpected error occurred'); setLoading(false); }
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
            <div className="font-semibold" style={{ color: '#1A1C1C', fontSize: '15px' }}>HatSafe</div>
            <div className="label-sm" style={{ fontSize: '9px' }}>COMPLIANCE PLATFORM</div>
          </div>
        </div>

        <div className="mb-8">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>Create account</h1>
          <p className="mt-1" style={{ color: '#474747' }}>14-day free trial · No credit card required</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="px-4 py-3 text-sm"
              style={{ backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name">YOUR NAME</label>
            <input id="name" type="text" placeholder="Ben Brown" required value={formData.name} onChange={set('name')} />
          </div>
          <div>
            <label htmlFor="org">COMPANY NAME</label>
            <input id="org" type="text" placeholder="Your Company Ltd" required value={formData.organisationName} onChange={set('organisationName')} />
          </div>
          <div>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input id="email" type="email" placeholder="you@company.com" required value={formData.email} onChange={set('email')} />
          </div>
          <div>
            <label htmlFor="password">PASSWORD</label>
            <input id="password" type="password" placeholder="Min. 8 characters" required value={formData.password} onChange={set('password')} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full"
            style={{ padding: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: '#A3A3A3' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1A1C1C', fontWeight: 500 }}>Sign in →</Link>
        </p>
        <p className="mt-4 text-center" style={{ fontSize: '11px', color: '#A3A3A3' }}>
          By signing up you agree to our Terms of Service and Privacy Policy
        </p>

      </div>
    </div>
  );
}
