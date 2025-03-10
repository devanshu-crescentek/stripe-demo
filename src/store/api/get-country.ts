import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getCountryAPI = createApi({
  reducerPath: 'country-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: process.env.NEXT_PUBLIC_POSTCODE_BASE_URL,
  }),
  endpoints: (builder) => ({
    getCountryDetails: builder.query({
      query: ({ postcode }) => {
        const url = `postcodes/${postcode}`

        return url
      },
    }),
    checkCountry: builder.mutation({
      query: ({ postalCode }) => ({
        url: `postcodes/${postalCode}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetCountryDetailsQuery, useCheckCountryMutation } =
  getCountryAPI
