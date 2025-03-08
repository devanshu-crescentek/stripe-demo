'use client'
import { FC, ReactNode, useEffect } from 'react'

import { usePathname } from 'next/navigation'
//posthog package
import posthog from 'posthog-js'

//react-redux package
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '@/store'

type AppProviderProps = {
  children: ReactNode
}

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    persistence: 'memory', // Ensures proper storage
    session_recording: {
      maskAllInputs: false,
    },
    enable_recording_console_log: true,
  })
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.capture('$pageview') // Automatically track page views
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>
  )
}

export default AppProvider
