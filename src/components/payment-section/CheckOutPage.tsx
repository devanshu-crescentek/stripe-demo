/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPaypal, FaStripe } from 'react-icons/fa'
import { RiVisaLine, RiMastercardFill } from 'react-icons/ri'
import { SiAmericanexpress } from 'react-icons/si'
import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import convertToSubCurrency from '@/lib/convertToSubCurrency'
import PaypalButton from './paypal-button'
import { FaApplePay, FaGooglePay } from 'react-icons/fa6'
import useDeviceType from '@/hooks/use-device-type'

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
import { Button } from '@/components/ui/button'

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false)

  const deviceType = useDeviceType()

  useEffect(() => {
    if (!stripe) return

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: convertToSubCurrency(amount),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.canMakePayment()
      .then((result) => {
        if (result) {
          setPaymentRequest(pr)
          setPaymentRequestAvailable(true)
        } else {
          console.warn('Google Pay / Apple Pay not available')
        }
      })
      .catch((error) => {
        console.warn('Error checking for Google Pay / Apple Pay', error)
      })
  }, [stripe, amount])

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

  const handlePaypalSuccess = (details: any) => {
    console.log('🚀 ~ Paypal success:', details)
    router.push('/payment-success?amount=' + amount)
  }

  return (
    <>
      <form className='bg-white md:p-2 p-0 rounded-md'>
        {/* Show Google Pay / Apple Pay Button if available */}
        {paymentRequestAvailable &&
          paymentRequest &&
          deviceType == 'desktop' && (
            <div className='mb-4 justify-center gap-4 hidden md:flex'>
              <div className='w-full'>
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
              <div className='w-full'>
                <PaypalButton
                  amount={amount.toString()}
                  onSuccess={handlePaypalSuccess}
                />
              </div>
            </div>
          )}

        {clientSecret && deviceType == 'desktop' && (
          <PaymentElement options={{ layout: 'accordion' }} />
        )}
        {errorMessage && deviceType == 'desktop' && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
            <span className='block sm:inline'>{errorMessage}</span>
          </div>
        )}
        <hr className='my-4 border-gray-300 hidden md:flex' />
        <div className='hidden md:flex items-center justify-between'>
          {/* Total Price */}
          <div>
            <p className='text-gray-500 text-sm'>Total</p>
            <p className='text-2xl font-bold'>£{amount}</p>
          </div>

          {/* Pay Button */}
          <button
            className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:animate-pulse'
            disabled={isProcessing || !stripe}
            onClick={() => handleSubmit()}
          >
            <span>Pay by card</span>
            <span>→</span>
          </button>
        </div>
      </form>
      <hr className='my-4 border-gray-300' />
      <div className='flex items-center justify-between gap-11'>
        {/* Secure Payment Text */}
        <h2 className='text-lg font-semibold'>Secure Payment</h2>

        {/* Payment Icons */}
        <div className='flex gap-2 flex-wrap'>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <FaPaypal className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <FaStripe className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <RiVisaLine className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <RiMastercardFill className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <SiAmericanexpress className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <FaApplePay className='text-[1.3rem]' />
          </div>
          <div className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded'>
            <FaGooglePay className='text-[1.3rem]' />
          </div>
        </div>
      </div>
      {paymentRequestAvailable && paymentRequest && deviceType === 'mobile' && (
        <div className='fixed block md:hidden bottom-0 left-0 w-full border shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.12)] rounded-t-xl p-4'>
          {/* Payment Methods */}
          <div className='flex justify-between space-x-3 mb-3'>
            <div className='w-full'>
              <PaymentRequestButtonElement options={{ paymentRequest }} />
            </div>
            <div className='w-full'>
              <PaypalButton
                amount={amount.toString()}
                onSuccess={handlePaypalSuccess}
              />
            </div>
          </div>

          {/* Total & Pay Button */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Total</p>
              <p className='text-2xl font-bold'>£29.95</p>
            </div>

            <Drawer>
              <DrawerTrigger>
                <button className='bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2'>
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
