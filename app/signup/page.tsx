'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organisationName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

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
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create user account')
        setLoading(false)
        return
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
      })

      if (!orgResponse.ok) {
        const errorData = await orgResponse.json()
        setError(errorData.error || 'Failed to create organisation')
        setLoading(false)
        return
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🦺</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-800">HatSafe</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
          <p className="text-sm text-gray-500 mt-1">14-day free trial, no credit card required</p>
        </div>

        {/* Signup Form */}
        <div className="card">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700 mb-2">
                Company name
              </label>
              <input
                id="organisationName"
                name="organisationName"
                type="text"
                required
                value={formData.organisationName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
                placeholder="Acme Construction Ltd"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
                placeholder="john@acme.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
                placeholder="At least 8 characters"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary-400 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-400 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-400 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-600">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <div>Secure & Compliant</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🚀</div>
            <div>5 min setup</div>
          </div>
          <div>
            <div className="text-2xl mb-1">💳</div>
            <div>No card needed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
