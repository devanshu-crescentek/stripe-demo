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
  const data = useAppSelector((state) => state.address.selectedAddress) || false

  const methods = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      tenure: 'not-sure',
      agreeTerms: false,
    },
  })

  useEffect(() => {
    if (data) {
      methods.setValue('address', data?.address ? data?.address : '')
      methods.setValue('city', data?.city ? data?.city : '')
      methods.setValue('country', data?.county ? data?.county : '')
      methods.setValue('postalCode', data?.postcode ? data?.postcode : '')
    }
  },[data, methods])

  return (
    <Form {...methods}>
      <FormProvider {...methods}>
        <form>
          <div className='h-full mb-10'>
            <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
              <div>
                <AddressInfo />
              </div>

              <div>
                <TenureInfo />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Form>
  )
}

export default ProductDetails
