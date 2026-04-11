'use client'

import { useState } from 'react'
import { SparklesIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'

interface DemoBannerProps {
  onCleared?: () => void
}

export default function DemoBanner({ onCleared }: DemoBannerProps) {
  const [clearing, setClearing] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  if (dismissed) return null

  const handleClear = async () => {
    setClearing(true)
    setError(null)
    try {
      const res = await fetch('/api/demo/clear', { method: 'POST' })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to clear demo data')
      }
      onCleared?.()
      // Refresh the page so all lists/counts update
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setClearing(false)
      setShowConfirm(false)
    }
  }

  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-3"
      style={{
        backgroundColor: '#FFF8E1',
        borderBottom: '1px solid #FFC107',
        fontSize: '13px',
      }}
    >
      {/* Left — icon + label */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SparklesIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#92400E' }} strokeWidth={2} />
        <span className="font-semibold" style={{ color: '#92400E' }}>DEMO DATA</span>
        <span style={{ color: '#92400E', marginLeft: '4px' }}>
          — This workspace is pre-populated with sample data for Apex Construction Ltd.
          Explore the product, then replace with your own data when you&apos;re ready.
        </span>
        {error && (
          <span className="font-medium" style={{ color: '#B91C1C', marginLeft: '8px' }}>
            {error}
          </span>
        )}
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: '#000000',
              color: '#FFFFFF',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1A1C1C')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#000000')}
          >
            <TrashIcon className="w-3 h-3" strokeWidth={2} />
            Clear demo data
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: '#92400E' }}>
              Remove all sample data?
            </span>
            <button
              onClick={handleClear}
              disabled={clearing}
              className="px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '4px',
                border: 'none',
                cursor: clearing ? 'not-allowed' : 'pointer',
                opacity: clearing ? 0.6 : 1,
              }}
            >
              {clearing ? 'Clearing…' : 'Yes, clear it'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: 'transparent',
                color: '#92400E',
                borderRadius: '4px',
                border: '1px solid #FFC107',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1 transition-opacity"
          style={{ color: '#92400E', background: 'none', border: 'none', cursor: 'pointer' }}
          title="Dismiss banner"
        >
          <XMarkIcon className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
