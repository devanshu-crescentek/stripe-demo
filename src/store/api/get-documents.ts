import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getDocumentAPI = createApi({
  reducerPath: 'document-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  }),
  endpoints: (builder) => ({
    getDocumentList: builder.query({
      query: ({ country }) => {
        const url = `get-land-registry-product-data?${country}`

        return url
      },
    }),
  }),
})

export const { useGetDocumentListQuery } = getDocumentAPI
