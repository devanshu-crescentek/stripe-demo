import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const getDocumentAPI = createApi({
  reducerPath: 'document-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl: 'https://api.postcodes.io/',
  }),
  endpoints: (builder) => ({
    getDocumentList: builder.query({
      query: ({ country }) => {
        const url = `postcodes/${country}`

        return url
      },
    }),
  }),
})

export const { useGetDocumentListQuery } = getDocumentAPI
