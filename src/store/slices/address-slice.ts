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
    country?: string
    postalCode?: string
  } | null
  tenure_info: {
    tenure?: string | null
    titleNumber?: number | null
  }
  documents: {
    id: number
    name: string
    description?: string
    price: number
    country?: string
  }[]
  selectedDocuments: {
    id: number
    name: string
    description?: string
    price: number
    country?: string
  }[]
}

const initialState: AddressState = {
  data: [],
  loading: false,
  error: null,
  selectedAddress: null,
  tenure_info: {
    tenure: null,
    titleNumber: null,
  },
  documents: [],
  selectedDocuments: [],
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
        country?: string
        postalCode?: string
      } | null>
    ) => {
      state.selectedAddress = action.payload ?? null
    },
    setTenureInfo: (
      state,
      action: PayloadAction<{
        tenure?: string | null
        titleNumber?: number | null
      }>
    ) => {
      state.tenure_info = action.payload
    },
    setDocuments: (
      state,
      action: PayloadAction<
        {
          id: number
          name: string
          description?: string
          price: number
          country?: string
        }[]
      >
    ) => {
      state.documents = action.payload
    },
    setSelectedDocuments: (
      state,
      action: PayloadAction<
        {
          id: number
          name: string
          description?: string
          price: number
          country?: string
        }[]
      >
    ) => {
      state.selectedDocuments = action.payload
    },
    resetAddress: (state) => {
      state.data = []
      state.loading = false
      state.error = null
      state.selectedAddress = null
      state.tenure_info = {
        tenure: null,
        titleNumber: null,
      }
      state.documents = []
      state.selectedDocuments = []
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

export const {
  resetAddress,
  setSelectedAddress,
  setTenureInfo,
  setDocuments,
  setSelectedDocuments,
} = addressSlice.actions

export default addressSlice.reducer
