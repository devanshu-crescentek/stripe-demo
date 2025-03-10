import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getAddressAPI = createApi({
  reducerPath: 'api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: process.env.NEXT_PUBLIC_ADDRESSIAN_BASE_URL,
    apiKey: process.env.NEXT_PUBLIC_ADDRESS_SECRET_KEY || '',
  }),
  endpoints: (builder) => ({
    getAddressDetails: builder.mutation({
      query: (id) => ({
        url: `autocomplete/${id}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetAddressDetailsMutation } = getAddressAPI
