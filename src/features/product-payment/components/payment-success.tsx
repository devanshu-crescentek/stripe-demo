'use client'

import { redirect, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAppSelector } from '@/store/hook'
import { getEstimatedTime, getNextBusinessDayTime } from '@/lib/utils'

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get('amount')

  const {
    selectedAddress,
    tenure_info,
    selectedDocuments,
    orderID,
    payment,
    paymentTime,
    email,
  } = useAppSelector((state) => state.address) || {}

  if (
    !selectedAddress ||
    !tenure_info ||
    !selectedDocuments ||
    selectedDocuments.length === 0 ||
    !orderID
  ) {
    redirect('/')
  }

  const fastTrack = selectedDocuments.find(
    (document) => document.name === 'Fast Track'
  )

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
          <div className='flex sm:items-start items-center flex-col'>
            <h2 className='font-semibold sm:text-[40px] text-[26px] leading-[30px] mb-2'>
              Order Successful!
            </h2>
            <p className='font-medium text-[20px] leading-[30px] capitalize'>
              Order ID: <span className='text-[#28A745]'>{orderID}</span>
            </p>
          </div>
        </div>
        <div className='w-full md:grid lg:grid-cols-2 flex flex-col-reverse sm:gap-6 gap-4'>
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
              <div className='flex flex-row items-center justify-between gap-4'>
                <div className='flex flex-col w-full items-start mb-4 gap-2'>
                  <h4 className='font-normal sm:text-[20px] text-[18px] leading-[30px] text-[#868686] '>
                    Payment Method
                  </h4>
                  <div className='h-[22px] flex items-center justify-center'>
                    <Image
                      width={30}
                      height={12}
                      src={
                        payment === 'card'
                          ? '/icons/Visa.svg'
                          : '/icons/paypal.svg'
                      }
                      alt='visa'
                      className={`w-[56px] h-auto`}
                    />
                  </div>
                </div>
                <div className='flex flex-col w-full items-end mb-4'>
                  <h2 className='font-normal sm:text-[20px] text-[18px] leading-[30px] text-[#868686]'>
                    Order Total
                  </h2>
                  <h2 className='font-semibold sm:text-[30px] text-[22px] leading-[30px]'>
                    £{amount}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-start   gap-2'>
                <div className='sm:w-[43px] w-[27px] sm:h-[43px] h-[27px]'>
                  <Image
                    src='/mail.svg'
                    alt='mail'
                    width={30}
                    height={30}
                    className='w-full h-full object-contain'
                  />
                </div>
                <div className='flex flex-col items-start'>
                  <h4 className='font-medium sm:text-[26px] text-[18px] sm:leading-[30px] leading-[23px] mb-1 capitalize'>
                    Your documents will be delivered via email
                  </h4>
                  <a
                    href={`mailto:${email}`}
                    target='_blank'
                    className='text-[#28A745] font-medium sm:text-[20px] text-[14px] leading-[20px] mb-2'
                  >
                    {email}
                  </a>
                  <p className='text-[#868686] font-medium sm:text-[20px] text-[14px] leading-[20px]'>
                    (If not in inbox,{' '}
                    <span className='text-[#28A745]'>check junk/spam</span>)
                  </p>
                </div>
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex flex-col gap-4 justify-start items-start'>
                {fastTrack ? (
                  <>
                    <div className='flex items-start gap-2'>
                      <div className='w-[43px] h-[43px]'>
                        <Image
                          src='/fast_track_delivery.svg'
                          alt='Fast track delivery'
                          width={100}
                          height={100}
                          className='w-full h-full'
                        />
                      </div>
                      <div className='flex flex-col'>
                        <h4 className='font-medium sm:text-[26px] text-[18px] sm:leading-[30px] leading-[20px] mb-2'>
                          Your Fast Track Delivery is on its way! should arrive
                          by
                        </h4>
                        <p className='text-[#28A745] sm:text-[18px] text-[12px] sm:leading-[20px] leading-[15px]'>
                          {getEstimatedTime(
                            'Europe/London',
                            new Date(paymentTime as string)
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='flex items-start gap-2'>
                      <div className='w-[43px] h-[43px]'>
                        <Image
                          src='/standard_delivery.svg'
                          alt='standard delivery'
                          width={100}
                          height={100}
                          className='w-full h-auto'
                        />
                      </div>
                      <div className='flex flex-col'>
                        <h4 className='font-medium sm:text-[26px] text-[18px] sm:leading-[30px] leading-[20px] mb-2'>
                          Your standard delivery is on its way! should arrive by
                        </h4>
                        <p className='text-[#28A745] sm:text-[18px] text-[12px] sm:leading-[20px] leading-[15px]'>
                          {getNextBusinessDayTime(
                            'Europe/London',
                            new Date(paymentTime as string)
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
