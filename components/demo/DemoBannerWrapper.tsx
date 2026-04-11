'use client'

import { useEffect, useState } from 'react'
import DemoBanner from './DemoBanner'

export default function DemoBannerWrapper() {
  const [demoActive, setDemoActive] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch('/api/demo/status')
      .then(r => r.json())
      .then(d => {
        setDemoActive(d.demoActive ?? false)
        setChecked(true)
      })
      .catch(() => setChecked(true))
  }, [])

  if (!checked || !demoActive) return null

  return <DemoBanner onCleared={() => setDemoActive(false)} />
}
