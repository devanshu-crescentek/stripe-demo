'use client'
import { Suspense, useEffect } from 'react'

import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Card, CardContent } from '@/components/ui/card'
import { useAppSelector } from '@/store/hook'
import { useGetCountryDetailsQuery } from '@/store/api/get-country'
import posthog from 'posthog-js'

const ProductLoaderDetails = () => {
  // const router = useRouter()

  const { selectedAddress } = useAppSelector((state) => state.address)

  const address = selectedAddress?.address || ''
  const city = selectedAddress?.city || ''
  const country = selectedAddress?.country || ''
  const postalCode = selectedAddress?.postalCode || ''

  const { data } = useGetCountryDetailsQuery(
    {
      postcode: postalCode,
    },
    {
      skip: !postalCode || postalCode === '',
      refetchOnMountOrArgChange: true,
    }
  )

  const countryFromApi = data?.result?.country || ''

  // Second API Call: Trigger when `countryFromApi` is available
  // const {
  //   data: additionalData,
  //   isLoading: isSecondLoading,
  //   isError: isSecondError,
  // } = useSecondQuery(
  //   { country: countryFromApi },
  //   {
  //     skip: !countryFromApi,
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  // useEffect(() => {
  //   if (isError || isSecondError) {
  //     // Redirect back if any API fails
  //     router.back();
  //   } else if (data && additionalData) {
  //     // Redirect to the next page when both API calls succeed
  //     router.push("/product-payment");
  //   }
  // }, [data, additionalData, isError, isSecondError]);

  useEffect(() => {
    const delay = Math.floor(Math.random() * (4000 - 2000 + 1)) + 2000
    const timer = setTimeout(() => {
      if (countryFromApi) {
        posthog.capture('Order_Country_Details', {
          country: countryFromApi,
        })
        redirect('/product-payment')
      } else {
        redirect('/details')
      }
    }, delay)

    return () => clearTimeout(timer) // Cleanup function to prevent memory leaks
  }, [countryFromApi])

  return (
    <div className='h-fit container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12 lg:pt-10 md:pt-5 pt-10 pb-10'>
      <Card>
        <CardContent className='py-8 px-6 flex flex-col items-center justify-center gap-10 h-full'>
          <div className='w-full h-3/4'>
            <Image
              src='/searching-web.gif'
              alt='Searching Animation'
              width={100}
              height={100}
              className='w-full h-full object-contain'
            />
          </div>
          <div className='h-full w-full flex flex-col items-center justify-center text-center '>
            <h2 className='md:my-4 my-2 md:text-[40px] text-[24px] md:leading-[40px] leading-[30px] font-semibold text-[#28A745]'>
              Searching Title Documents
            </h2>
            <p className='md:text-[30px] text-[15px] leading-[30px] text-center mt-2'>
              {address || 'N/A'}, {city || 'N/A'}, {country || 'N/A'},{' '}
              {postalCode || 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='md:p-[71px] p-[25px] flex flex-col items-center justify-center h-full'>
          <div className='relative flex items-center justify-center md:w-[90px] w-[55px] md:h-[90px] h-[55px]'>
            <Image
              src='/ownership-docs.png'
              alt='Documents Icon'
              width={64}
              height={64}
              className='w-full h-auto'
            />
          </div>
          <p className='text-[#000] md:text-[30px] text-[18px] md:leading-[40px] leading-[30px] text-center mt-4'>
            Ownership Disputes Often Arise Due To Missing Documents—
            <span className='text-[#28A745] font-semibold'>
              {' '}
              Good Thing You’re Securing Yours Now!
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProductLoader() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductLoaderDetails />
      </Suspense>
    </>
  )
}
