import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReAuth from '../fetch-base-query'

export const addToCartAPI = createApi({
  reducerPath: 'add-cart-api',
  baseQuery: createBaseQueryWithReAuth({
    authCheck: false,
    baseUrl:
      'https://phpstack-1400660-5285689.cloudwaysapps.com/wp-json/crsc/v1/',
    timeout: 65000,
  }),
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: `crsc-lr-add-to-cart`,
        method: 'POST',
        body: data,
      }),
    }),
    updateCart: builder.mutation({
      query: (data) => ({
        url: `crsc-lr-update-cart`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useAddToCartMutation, useUpdateCartMutation } = addToCartAPI
