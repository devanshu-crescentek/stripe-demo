import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getCountryAPI = createApi({
  reducerPath: 'country-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: 'https://api.postcodes.io/',
  }),
  endpoints: (builder) => ({
    getCountryDetails: builder.query({
      query: ({ postcode }) => {
        const url = `postcodes/${postcode}`

        return url
      },
    }),
  }),
})

export const { useGetCountryDetailsQuery } = getCountryAPI
