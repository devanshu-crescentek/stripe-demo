import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getAddressAPI } from '@/store/api/get-address'

interface AddressState {
  data: []
  loading: boolean
  error: string | null
  selectedAddress: {
    address?: string
    city?: string
    county?: string
    postcode?: string
  } | null
}

const initialState: AddressState = {
  data: [],
  loading: false,
  error: null,
  selectedAddress: null,
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (
      state,
      action: PayloadAction<{
        address?: string
        city?: string
        county?: string
        postcode?: string
      } | null> 
    ) => {
      state.selectedAddress = action.payload ?? null;
    },
    resetAddress: (state) => {
      state.data = []
      state.loading = false
      state.error = null
      state.selectedAddress = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        getAddressAPI.endpoints.getAddressDetails.matchPending,
        (state) => {
          state.loading = true
          state.error = null
        }
      )
      .addMatcher(
        getAddressAPI.endpoints.getAddressDetails.matchFulfilled,
        (state, action: PayloadAction<[]>) => {
          state.loading = false
          state.data = action.payload
        }
      )
      .addMatcher(
        getAddressAPI.endpoints.getAddressDetails.matchRejected,
        (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Something went wrong'
        }
      )
  },
})

export const { resetAddress ,setSelectedAddress} = addressSlice.actions

export default addressSlice.reducer
