'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppSelector } from '@/store/hook'

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')

  const { selectedAddress, tenure_info, documents } =
    useAppSelector((state) => state.address) || {}

  return (
    <div className='flex-1 mb-10'>
      <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
        <div className='flex justify-center items-center mb-10'>
          <div className='w-[149px] h-[115px]'>
            <Image
              src='/success.gif'
              alt='Success Animation'
              width={100}
              height={100}
              className='w-full h-full object-contain'
            />
          </div>
          <h2 className='font-semibold text-[40px] leading-[30px]'>
            Order Successful!
          </h2>
        </div>
        <div className='w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <h3 className='md:text-[40px] text-[24px] leading-[30px] font-semibold'>
                Property details
              </h3>
            </CardHeader>
            <CardContent>
              <div className='flex items-start justify-between gap-4 mb-4'>
                <p className='text-[##0B0C0C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal w-full'>
                  {selectedAddress?.address && `${selectedAddress?.address}, `}
                  {selectedAddress?.city && `${selectedAddress?.city}, `}
                  {selectedAddress?.country && `${selectedAddress?.country}`}
                  <br />
                  {selectedAddress?.postalCode && selectedAddress?.postalCode}
                  <br />
                  {tenure_info?.titleNumber && (
                    <>Title Number: {tenure_info.titleNumber}</>
                  )}
                </p>
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center justify-between">
                    <h4 className='font-semibold text-[20px] leading-[30px]'>Title Register</h4>
                    <p></p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card></Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
