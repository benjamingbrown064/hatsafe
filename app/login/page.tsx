'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button, Checkbox } from '@heroui/react';
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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">H</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">HatSafe</h1>
          </div>
          <p className="text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <Card shadow="sm">
          <CardBody className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Input
                type="email"
                label="Email address"
                placeholder="you@company.com"
                value={email}
                onValueChange={setEmail}
                required
                variant="bordered"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700",
                }}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onValueChange={setPassword}
                required
                variant="bordered"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700",
                }}
              />

              <div className="flex items-center justify-between">
                <Checkbox size="sm">
                  <span className="text-sm text-gray-700">Remember me</span>
                </Checkbox>
                <Link
                  href="/forgot-password"
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                color="warning"
                size="lg"
                className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
                isLoading={loading}
              >
                Sign in
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Compliance made simple. Never miss an expiry again.
          </p>
        </div>
      </div>
    </div>
  );
}
