 
'use client'

import useDeviceType from '@/hooks/use-device-type'
import convertToSubCurrency from '@/lib/convertToSubCurrency'
import {
  PaymentElement,
  // PaymentRequestButtonElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
// import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import PaypalButton from './paypal-button'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()
  // const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState('')
  // const [paymentRequest, setPaymentRequest] = useState<any>(null)
  // const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false)

  const deviceType = useDeviceType()

  // useEffect(() => {
  //   if (!stripe) return

  //   const pr = stripe.paymentRequest({
  //     country: 'US',
  //     currency: 'usd',
  //     total: {
  //       label: 'Total',
  //       amount: convertToSubCurrency(amount),
  //     },
  //     requestPayerName: true,
  //     requestPayerEmail: true,
  //   })

  //   pr.canMakePayment()
  //     .then((result) => {
  //       if (result) {
  //         setPaymentRequest(pr)
  //         setPaymentRequestAvailable(true)
  //       } else {
  //         console.warn('Google Pay / Apple Pay not available')
  //       }
  //     })
  //     .catch((error) => {
  //       console.warn('Error checking for Google Pay / Apple Pay', error)
  //     })
  // }, [stripe, amount])

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: convertToSubCurrency(amount),
      }),
    })
      .then(async (res) => {
        const { clientSecret } = await res.json()
        setClientSecret(clientSecret)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [amount])

  const handleSubmit = async () => {
    setIsProcessing(true)

    if (!stripe || !elements) {
      return
    }

    const { error: submitError } = await elements.submit()

    if (submitError) {
      setErrorMessage(submitError.message!)
      setIsProcessing(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    })

    if (error) {
      setErrorMessage(error.message!)
    }
    setIsProcessing(false)
  }

  if (!clientSecret || !stripe || !elements) {
    return (
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
    )
  }

  // const handlePaypalSuccess = (details: any) => {
  //   console.log('🚀 ~ Paypal success:', details)
  //   router.push('/payment-success?amount=' + amount)
  // }

  return (
    <>
      {deviceType === 'desktop' && (
        <>
          <Card className='mb-6'>
            <CardContent className='p-6'>
              {clientSecret && deviceType == 'desktop' && (
                <PaymentElement options={{ layout: 'accordion' }} />
              )}
              {errorMessage && deviceType == 'desktop' && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
                  <span className='block sm:inline'>{errorMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className='mb-6'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between gap-6'>
                {/* Secure Payment Text */}
                <h2 className='md:text-[20px] text-[15px] font-semibold whitespace-nowrap'>
                  Secure Payment
                </h2>

                {/* Payment Icons */}
                <div className='flex flex-wrap items-center justify-start gap-1'>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    {/* <FaPaypal className='text-[1.3rem]' /> */}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='7.056000232696533 3 37.35095977783203 45'
                      className='w-[30px] h-[12px]'
                    >
                      <g xmlns='http://www.w3.org/2000/svg' clipPath='url(#a)'>
                        <path
                          fill='#002991'
                          d='M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z'
                        ></path>
                        <path
                          fill='#60CDFF'
                          d='M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z'
                        ></path>
                        <path
                          fill='#008CFF'
                          d='M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z'
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-[30px] h-[12px]'
                      viewBox='0 0 512 214'
                    >
                      <path
                        fill='#635BFF'
                        d='M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774'
                      />
                    </svg>
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    <svg
                      width='30'
                      height='12'
                      viewBox='0 0 30 12'
                      xmlns='http://www.w3.org/2000/svg'
                      xmlnsXlink='http://www.w3.org/1999/xlink'
                    >
                      <g>
                        <g>
                          <path
                            d='M12.4,4.3L11.3,10h2.2l1.1-5.7H12.4z M9.1,4.3L7.1,9l-0.2-1l-0.1-0.5
               C6.2,6.8,5.5,5.6,4.2,4.5c-0.3-0.2-0.5-0.3-0.8-0.5l1.9,7.1h2.2l3.4-6.8H9.1z 
               M17.7,6.6c0-0.9,2.1-0.8,3-0.3l0.3-1.8c0,0-0.9-0.3-1.9-0.3c-1,0-3.6,0.5-3.6,2.8
               c0,2.2,3,2.2,3,3.3c0,1.1-2.7,0.9-3.6,0.2l-0.3,1.8c0,0,1,0.5,2.5,0.5c1.5,0,3.7-0.8,3.7-2.8
               C20.7,7.8,17.7,7.6,17.7,6.6z 
               M26.7,4.3h-1.7c-0.8,0-1,0.6-1,0.6l-3.2,6.5h2.2l0.5-1.2h2.7l0.2,1.2h2L26.7,4.3z 
               M24,7.9l1.1-3l0.6,3H24z'
                            fillRule='evenodd'
                            clipRule='evenodd'
                            fill='#005BAC'
                          />
                        </g>
                      </g>
                      <g>
                        <g>
                          <path
                            d='M5.6,5.2c0,0-0.1-0.7-1-0.7H1.4l0,0.1c0,0,1.6,0.3,3.2,1.6c1.5,1.2,2,2.7,2,2.7L5.6,5.2z'
                            fillRule='evenodd'
                            clipRule='evenodd'
                            fill='#F6AC1D'
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    {/* <RiMastercardFill className='text-[1.3rem]' /> */}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='30'
                      height='12'
                      viewBox='0 0 30 12'
                    >
                      <g fill='none' fillRule='evenodd'>
                        <circle cx='9' cy='6' r='6' fill='#ea001b' />
                        <circle
                          cx='17'
                          cy='6'
                          r='6'
                          fill='#ffa200'
                          fillOpacity='0.8'
                        />
                      </g>
                    </svg>
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    <Image
                      width={30}
                      height={10}
                      src={'/a-express.png'}
                      alt='american-express'
                    />
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    <Image
                      width={30}
                      height={10}
                      src={'/apple-pay.png'}
                      alt='Apple Pay'
                    />
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
                    <Image
                      width={30}
                      height={12}
                      src={'/g-pay.png'}
                      alt='gpay'
                    />
                  </div>
                  <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded h-[22px] flex items-center justify-center'>
                    <Image
                      width={30}
                      height={100}
                      src={'/card.png'}
                      alt='Card'
                    />
                  </div>
                </div>
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4'></div>
              {/* Show Google Pay / Apple Pay Button if available */}
              {/* {paymentRequestAvailable &&
                paymentRequest &&
                deviceType == 'desktop' && (
                  <div className='mb-4 justify-center gap-4 hidden md:flex'>
                    <div className='w-full'>
                      <PaymentRequestButtonElement
                        options={{ paymentRequest }}
                      />
                    </div>
                    <div className='w-full'>
                      <PaypalButton
                        amount={amount.toString()}
                        onSuccess={handlePaypalSuccess}
                      />
                    </div>
                  </div>
                )} */}
              <div className='hidden md:flex items-center justify-between'>
                {/* Total Price */}
                <div>
                  <p className='text-gray-500 text-sm mb-2'>Total</p>
                  <p className='text-[40px] leading-[22px] font-semibold'>
                    £{amount}
                  </p>
                </div>

                {/* Pay Button */}
                <button
                  className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-[4px] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:animate-pulse w-[246px] h-[40px]'
                  disabled={isProcessing || !stripe}
                  onClick={() => handleSubmit()}
                >
                  <span>Pay by card</span>
                  <span>→</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {deviceType === 'mobile' && (
        <div className='flex items-center justify-between gap-6 mb-52'>
          {/* Secure Payment Text */}
          <h2 className='md:text-[20px] text-[15px] font-semibold whitespace-nowrap'>
            Secure Payment
          </h2>

          {/* Payment Icons */}
          <div className='flex flex-wrap items-center justify-start gap-1'>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              {/* <FaPaypal className='text-[1.3rem]' /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='7.056000232696533 3 37.35095977783203 45'
                className='w-[30px] h-[12px]'
              >
                <g xmlns='http://www.w3.org/2000/svg' clipPath='url(#a)'>
                  <path
                    fill='#002991'
                    d='M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z'
                  ></path>
                  <path
                    fill='#60CDFF'
                    d='M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z'
                  ></path>
                  <path
                    fill='#008CFF'
                    d='M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z'
                  ></path>
                </g>
              </svg>
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-[30px] h-[12px]'
                viewBox='0 0 512 214'
              >
                <path
                  fill='#635BFF'
                  d='M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774'
                />
              </svg>
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              <svg
                width='30'
                height='12'
                viewBox='0 0 30 12'
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
              >
                <g>
                  <g>
                    <path
                      d='M12.4,4.3L11.3,10h2.2l1.1-5.7H12.4z M9.1,4.3L7.1,9l-0.2-1l-0.1-0.5
       C6.2,6.8,5.5,5.6,4.2,4.5c-0.3-0.2-0.5-0.3-0.8-0.5l1.9,7.1h2.2l3.4-6.8H9.1z 
       M17.7,6.6c0-0.9,2.1-0.8,3-0.3l0.3-1.8c0,0-0.9-0.3-1.9-0.3c-1,0-3.6,0.5-3.6,2.8
       c0,2.2,3,2.2,3,3.3c0,1.1-2.7,0.9-3.6,0.2l-0.3,1.8c0,0,1,0.5,2.5,0.5c1.5,0,3.7-0.8,3.7-2.8
       C20.7,7.8,17.7,7.6,17.7,6.6z 
       M26.7,4.3h-1.7c-0.8,0-1,0.6-1,0.6l-3.2,6.5h2.2l0.5-1.2h2.7l0.2,1.2h2L26.7,4.3z 
       M24,7.9l1.1-3l0.6,3H24z'
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill='#005BAC'
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d='M5.6,5.2c0,0-0.1-0.7-1-0.7H1.4l0,0.1c0,0,1.6,0.3,3.2,1.6c1.5,1.2,2,2.7,2,2.7L5.6,5.2z'
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill='#F6AC1D'
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              {/* <RiMastercardFill className='text-[1.3rem]' /> */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='30'
                height='12'
                viewBox='0 0 30 12'
              >
                <g fill='none' fillRule='evenodd'>
                  <circle cx='9' cy='6' r='6' fill='#ea001b' />
                  <circle
                    cx='17'
                    cy='6'
                    r='6'
                    fill='#ffa200'
                    fillOpacity='0.8'
                  />
                </g>
              </svg>
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              <Image
                width={30}
                height={10}
                src={'/a-express.png'}
                alt='american-express'
              />
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              <Image
                width={30}
                height={10}
                src={'/apple-pay.png'}
                alt='Apple Pay'
              />
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
              <Image width={30} height={12} src={'/g-pay.png'} alt='gpay' />
            </div>
            <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded h-[22px] flex items-center justify-center'>
              <Image width={30} height={100} src={'/card.png'} alt='Card' />
            </div>
          </div>
        </div>
      )}
      { deviceType === 'mobile' && (
        <div className='fixed block md:hidden bottom-0 left-0 w-full border shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.12)] rounded-t-xl p-4 bg-white'>
          {/* Payment Methods */}
          {/* <div className='flex justify-between space-x-3 mb-3'>
            <div className='w-full'>
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </div>
            <div className='w-full'>
              <PaypalButton
                amount={amount.toString()}
                onSuccess={handlePaypalSuccess}
              />
            </div>
          </div> */}

          {/* Total & Pay Button */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Total</p>
              <p className='text-2xl font-bold'>£29.95</p>
            </div>

            <Drawer>
              <DrawerTrigger>
                <button className='bg-green-500 hover:bg-green-600 text-white justify-center font-medium py-3 px-6 rounded-[4px] flex items-center space-x-2 w-[189px] h-[40px]'>
                  <span>Pay By Card</span>
                  <span>→</span>
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Card</DrawerTitle>
                  <DrawerDescription>
                    <PaymentElement options={{ layout: 'accordion' }} />
                    {errorMessage && (
                      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
                        <span className='block sm:inline'>{errorMessage}</span>
                      </div>
                    )}
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button
                    onClick={() => handleSubmit()}
                    disabled={isProcessing || !stripe}
                  >
                    Pay
                  </Button>
                  <DrawerClose>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setErrorMessage('')
                        setIsProcessing(false)
                      }}
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </>
  )
}

export default CheckOutPage
