'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppSelector } from '@/store/hook'

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')

  const { selectedAddress, tenure_info, selectedDocuments } =
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
              <div className='flex flex-col items-center justify-center gap-4'>
                {selectedDocuments?.map((item, index) => (
                  <div
                    key={index}
                    className='flex w-full items-center justify-between mb-4'
                  >
                    <h4 className='font-semibold text-[20px] leading-[30px]'>
                      {item.name}
                    </h4>
                    <p className='font-semibold text-[20px] leading-[30px]'>
                      £{item.price}
                    </p>
                  </div>
                ))}
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex flex-col items-center justify-between gap-4'>
                <div className='flex w-full items-center justify-between mb-4'>
                  <h2 className='font-semibold text-[30px] leading-[30px]'>
                    Order Total
                  </h2>
                  <h2 className='font-semibold text-[30px] leading-[30px]'>
                    £{amount}
                  </h2>
                </div>
                <div className='flex w-full items-center justify-between mb-4'>
                  <h4 className='font-semibold text-[20px] leading-[30px]'>
                    Payment Method
                  </h4>
                  <div className='h-[22px] flex items-center justify-center'>
                    <Image
                      width={30}
                      height={12}
                      src={'/icons/Visa.svg'}
                      alt='visa'
                      className={`w-[42px] h-auto`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className='md:text-[40px] text-[24px] leading-[40px] font-semibold'>
                Your documents will be delivered via email
              </h3>
            </CardHeader>
            <CardContent>
              <h4 className='font-semibold text-[24px] leading-[30px] mb-4'>
                Important note
              </h4>
              <p className='text-[#0B0C0C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal w-full'>
                *In case you don&apos;t see your order in your inbox, kindly{' '}
                <span className='text-green-500'>
                  check your junk or spam folder
                </span>
              </p>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex flex-col gap-4 justify-start items-start'>
                <div className='flex flex-col'>
                  <div className=''>Standard Delivery:</div>
                  <p>
                    Arrives within 1 business day (Monday–Friday, 8 AM–5 PM).
                  </p>
                </div>
                <div className='flex flex-col'>
                  <div className=''>Fast Track Delivery</div>
                  <p>
                  Arrives within 1 business hour (Monday–Friday, 8 AM–5 PM).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
