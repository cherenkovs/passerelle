import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/jetbrains-mono'
import './index.css'

import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { loadVoices } from '@/lib/speech'
import { adoptLegacyLocalData } from '@/lib/sync'
import App from './App'

// Warm the voice list early — Chrome populates it asynchronously.
void loadVoices()

// Before the first render, not in an effect: the router decides whether there
// is a profile on that very first pass, and an effect runs too late — a
// returning learner was bounced to onboarding while their rescued progress was
// still a tick away.
adoptLegacyLocalData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={300} skipDelayDuration={200}>
        <App />
      </TooltipProvider>
    </MotionConfig>
  </StrictMode>,
)
