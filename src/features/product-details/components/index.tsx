/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect } from 'react'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import posthog from 'posthog-js'

import { Form } from '@/components/ui/form'
import { useAppDispatch, useAppSelector } from '@/store/hook'

import TenureInfo from '@/features/product-details/components/tenure-info'
import AddressInfo from '@/features/product-details/components/address-info'

import { useGetCountryDetailsQuery } from '@/store/api/get-country'
import { productDetailsSchema } from '@/features/product-details/schema'
import { setSelectedAddress } from '@/store/slices/address-slice'

const ProductDetails = () => {
  const dispatch = useAppDispatch()
  const { selectedAddress, tenure_info } =
    useAppSelector((state) => state.address) || false

  const methods = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      tenure:
        (tenure_info.tenure as 'freehold' | 'leasehold' | 'not-sure') ||
        'not-sure',
      agreeTerms: true,
    },
  })

  const { data, isLoading } = useGetCountryDetailsQuery(
    {
      postcode: selectedAddress?.postalCode,
    },
    {
      skip: !selectedAddress?.postalCode,
      refetchOnMountOrArgChange: true,
    }
  )

  const countryFromApi = data?.result?.country || selectedAddress?.country

  useEffect(() => {
    if (selectedAddress && !isLoading) {
      methods.setValue(
        'address',
        selectedAddress?.address ? selectedAddress?.address : ''
      )
      methods.setValue(
        'city',
        selectedAddress?.city ? selectedAddress?.city : ''
      )
      methods.setValue('country', countryFromApi)
      methods.setValue(
        'postalCode',
        selectedAddress?.postalCode ? selectedAddress?.postalCode : ''
      )
    }
    if (tenure_info) {
      methods.setValue(
        'title_number',
        tenure_info?.titleNumber as number | undefined
      )
      methods.setValue(
        'tenure',
        (tenure_info?.tenure as 'freehold' | 'leasehold' | 'not-sure') ||
          'not-sure'
      )
    }
  }, [
    selectedAddress,
    methods,
    tenure_info,
    isLoading,
    countryFromApi,
    dispatch,
  ])

  useEffect(() => {
    const payload = {
      ...selectedAddress,
      country: countryFromApi,
    }
    dispatch(setSelectedAddress(payload))
    posthog.capture('Selected address', {
      address: selectedAddress?.address ? selectedAddress?.address : '',
      city: selectedAddress?.city ? selectedAddress?.city : '',
      country: countryFromApi,
      postalCode: selectedAddress?.postalCode
        ? selectedAddress?.postalCode
        : '',
    })
  }, [countryFromApi, dispatch])

  if (isLoading) {
    return (
      <div className='flex-1'>
        <div className='flex items-center justify-center'>
          <div
            className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white'
            role='status'
          >
            <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
              Loading...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Form {...methods}>
      <FormProvider {...methods}>
        <form className='flex-1 mb-10'>
          <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
            <div>
              <AddressInfo />
            </div>

            <div>
              <TenureInfo />
            </div>
          </div>
        </form>
      </FormProvider>
    </Form>
  )
}

export default ProductDetails
