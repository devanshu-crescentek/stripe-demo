import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { Middleware } from '@reduxjs/toolkit'

import { concatMiddleware, rootReducer } from '@/store/root-reducer'


// Define RootState type
export type RootState = ReturnType<typeof rootReducer>

// Persist configuration
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false,
    }).concat(concatMiddleware as Middleware[]),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
