'use client'
import { FC, ReactNode } from 'react'

//react-redux package
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { persistor, store } from '@/store'

import { Toaster } from '@/components/ui/sonner'

type AppProviderProps = {
  children: ReactNode
}

const AppProvider: FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <Toaster duration={2000} />
        </PersistGate>
      </Provider>
    </>
  )
}

export default AppProvider
