import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getDocumentAPI = createApi({
  reducerPath: 'document-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: 'https://phpstack-1400660-5285689.cloudwaysapps.com/wp-json/crsc/v1/',
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
