import { combineReducers, Middleware } from '@reduxjs/toolkit'

// Import all API here
import { getAddressAPI } from '@/store/api/get-address'
import { getCountryAPI } from '@/store/api/get-country'

// Import all slices here
import addressSlice from '@/store/slices/address-slice'

// Root Reducer - Combine all slices here
export const rootReducer = combineReducers({
  [getAddressAPI.reducerPath]: getAddressAPI.reducer,
  [getCountryAPI.reducerPath]: getCountryAPI.reducer,

  address: addressSlice,
})

// Middleware - Extend this array with necessary middleware
export const concatMiddleware: Middleware[] = [
  getAddressAPI.middleware,
  getCountryAPI.middleware,
]
