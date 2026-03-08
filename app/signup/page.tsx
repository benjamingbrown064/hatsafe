'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organisationName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string) => (value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            organisation_name: formData.organisationName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Failed to create user account');
        setLoading(false);
        return;
      }

      // Step 2: Create organisation (via API route)
      const orgResponse = await fetch('/api/auth/create-organisation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: authData.user.id,
          organisation_name: formData.organisationName,
          user_name: formData.name,
        }),
      });

      if (!orgResponse.ok) {
        const errorData = await orgResponse.json();
        setError(errorData.error || 'Failed to create organisation');
        setLoading(false);
        return;
      }

      // Success! Redirect to dashboard
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
            Create your account to get started
          </p>
        </div>

        {/* Signup Form */}
        <Card shadow="sm">
          <CardBody className="p-8">
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Input
                type="text"
                label="Your name"
                placeholder="Ben Brown"
                value={formData.name}
                onValueChange={handleChange('name')}
                required
                variant="bordered"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700",
                }}
              />

              <Input
                type="text"
                label="Company name"
                placeholder="Your Company Ltd"
                value={formData.organisationName}
                onValueChange={handleChange('organisationName')}
                required
                variant="bordered"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700",
                }}
              />

              <Input
                type="email"
                label="Email address"
                placeholder="you@company.com"
                value={formData.email}
                onValueChange={handleChange('email')}
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
                placeholder="At least 8 characters"
                value={formData.password}
                onValueChange={handleChange('password')}
                required
                variant="bordered"
                description="Minimum 8 characters"
                classNames={{
                  input: "text-base",
                  label: "text-gray-700",
                }}
              />

              <Button
                type="submit"
                color="warning"
                size="lg"
                className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
                isLoading={loading}
              >
                Create account
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
