'use client'

import { redirect, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppSelector } from '@/store/hook'

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')

  const { selectedAddress, tenure_info, selectedDocuments, orderID } =
    useAppSelector((state) => state.address) || {}

  if (
    !selectedAddress ||
    !tenure_info ||
    !selectedDocuments ||
    selectedDocuments.length === 0 ||
    !orderID
  ) {
    redirect('/')
  }

  return (
    <div className='flex-1 mb-10'>
      <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
        <div className='flex sm:flex-row flex-col justify-center items-center mb-10'>
          <div className='w-[149px] h-[115px]'>
            <Image
              src='/success.gif'
              alt='Success Animation'
              width={100}
              height={100}
              className='w-full h-full object-contain'
            />
          </div>
          <h2 className='font-semibold sm:text-[40px] text-[26px] leading-[30px]'>
            Order Successful!
          </h2>
        </div>
        <div className='w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader className='sm:py-6 py-4'>
              <h3 className='sm:text-[40px] text-[18px] leading-[30px] font-semibold'>
                Property Details
              </h3>
            </CardHeader>
            <CardContent>
              <div className='flex items-start justify-between gap-4 mb-4'>
                <p className='text-[##0B0C0C] sm:text-[20px] text-[16px] md:leading-[30px] leading-[25px] font-normal w-full'>
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
              <div className='flex flex-col items-center justify-center sm:gap-4 gap-2'>
                {selectedDocuments?.map((item, index) => (
                  <div
                    key={index}
                    className='flex w-full items-center justify-between sm:mb-4 mb-2'
                  >
                    <h4 className='font-semibold sm:text-[20px] text-[18px] leading-[30px]'>
                      {item.name}
                    </h4>
                    <p className='font-semibold sm:text-[20px] text-[18px] leading-[30px]'>
                      £{item.price}
                    </p>
                  </div>
                ))}
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex flex-col items-center justify-between gap-4'>
                <div className='flex w-full items-center justify-between mb-4'>
                  <h2 className='font-semibold sm:text-[30px] text-[22px] leading-[30px]'>
                    Order Total
                  </h2>
                  <h2 className='font-semibold sm:text-[30px] text-[22px] leading-[30px]'>
                    £{amount}
                  </h2>
                </div>
                <div className='flex w-full items-center justify-between mb-4'>
                  <h4 className='font-semibold sm:text-[20px] text-[18px] leading-[30px]'>
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
              <h3 className='sm:text-[40px] text-[18px] sm:leading-[40px] leading-[23px] font-semibold'>
                Your Documents Will Be Delivered Via Email
              </h3>
            </CardHeader>
            <CardContent>
              <h4 className='font-semibold sm:text-[24px] text-[18px] leading-[30px] mb-1'>
                Important Note
              </h4>
              <p className='text-[#0B0C0C] sm:text-[20px] text-[18px] sm:leading-[30px] leading-[25px] font-normal w-full'>
                *In case you don&apos;t see your order in your inbox, kindly{' '}
                <span className='text-green-500'>
                  check your junk or spam folder
                </span>
              </p>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex flex-col gap-4 justify-start items-start'>
                <div className='flex items-start gap-2'>
                  <div className='w-[26px] h-[29px]'>
                    <Image
                      src='/standard_delivery.svg'
                      alt='standard delivery'
                      width={100}
                      height={100}
                      className='w-full h-auto'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <h4 className='font-medium sm:text-[24px] text-[18px] leading-[30px]'>
                      Standard Delivery:
                    </h4>
                    <p className='text-[#6B6B6B] sm:text-[20px] text-[12px] sm:leading-[30px] leading-[15px]'>
                      Arrives within 1 business day (Monday-Friday, 8 AM-5 PM).
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='w-[26px] h-[29px]'>
                    <Image
                      src='/fast_track_delivery.svg'
                      alt='Fast track delivery'
                      width={100}
                      height={100}
                      className='w-full h-full'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <h4 className='font-medium sm:text-[24px] text-[18px] leading-[30px]'>
                      Fast Track Delivery:
                    </h4>
                    <p className='text-[#6B6B6B] sm:text-[20px] text-[12px] sm:leading-[30px] leading-[15px]'>
                      Arrives within 1 business hour (Monday-Friday, 8 AM-5 PM).
                    </p>
                  </div>
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
