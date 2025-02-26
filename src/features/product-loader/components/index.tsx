'use client'
import React, { useEffect } from 'react'
import { Suspense } from 'react'
import { redirect, useSearchParams } from 'next/navigation'

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const ProductLoaderDetails = () => {
  const searchParams = useSearchParams()

  const address = searchParams.get('address') || ''
  const city = searchParams.get('city') || ''
  const country = searchParams.get('country') || ''
  const postalCode = searchParams.get('postalCode') || ''

  useEffect(() => {
    const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000
    const timer = setTimeout(() => {
      redirect('/product-payment')
    }, delay)

    return () => clearTimeout(timer) // Cleanup function to prevent memory leaks
  }, [])

  return (
    <div className='h-fit container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12 lg:pt-10 md:pt-5 pt-0 pb-10'>
      <Card>
        <CardContent className='py-8 px-6 flex flex-col items-center justify-center gap-10 h-full'>
          <div className='w-full h-3/4'>
            <Image
              src='/searching-web.gif' // Replace with the actual GIF path
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
