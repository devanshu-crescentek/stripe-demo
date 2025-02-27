'use client'
import AddressInfo from '@/features/product-details/components/address-info'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form } from '@/components/ui/form'

import TenureInfo from '@/features/product-details/components/tenure-info'
import { productDetailsSchema } from '@/features/product-details/schema'
import { useAppSelector } from '@/store/hook'
import { useEffect } from 'react'

const ProductDetails = () => {
  const { selectedAddress, tenure_info } =
    useAppSelector((state) => state.address) || false

  const methods = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      tenure: tenure_info.tenure as 'freehold' | 'leasehold' | 'not-sure' || 'not-sure',
      agreeTerms: false,
    },
  })

  useEffect(() => {
    if (selectedAddress) {
      methods.setValue(
        'address',
        selectedAddress?.address ? selectedAddress?.address : ''
      )
      methods.setValue(
        'city',
        selectedAddress?.city ? selectedAddress?.city : ''
      )
      methods.setValue(
        'country',
        selectedAddress?.country ? selectedAddress?.country : ''
      )
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
        tenure_info?.tenure as 'freehold' | 'leasehold' | 'not-sure' || 'not-sure'
      )
    }
  }, [selectedAddress, methods, tenure_info])

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
