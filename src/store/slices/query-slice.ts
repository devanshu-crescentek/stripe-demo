import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface QueryParamsState {
  params: Record<string, string | undefined>
}

const initialState: QueryParamsState = {
  params: {},
}

export const queryParamsSlice = createSlice({
  name: 'queryParams',
  initialState,
  reducers: {
    setQueryParams: (
      state,
      action: PayloadAction<Record<string, string | undefined>>
    ) => {
      state.params = { ...action.payload }
    },
    clearQueryParams: (state) => {
      state.params = {}
    },
  },
})

export const { setQueryParams, clearQueryParams } = queryParamsSlice.actions

export default queryParamsSlice.reducer
