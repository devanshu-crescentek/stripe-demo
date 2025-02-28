/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { JSX, useEffect, useState } from 'react'

import {
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useFormContext } from 'react-hook-form'

import { Card, CardContent } from '@/components/ui/card'
import PaymentDrawer from '@/features/product-payment/components/payment-drawer'
import PaypalButton from '@/features/product-payment/components/paypal-button'

import useDeviceType from '@/hooks/use-device-type'
import { paymentMethods } from '@/lib/constants'
import convertToSubCurrency from '@/lib/convertToSubCurrency'

const expressCheckoutOptions = {
  buttonHeight: 40,
}

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const { handleSubmit, watch } = useFormContext()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false)
  const [isExpressCheckout, setIsExpressCheckout] = useState(true)

  const deviceType = useDeviceType()
  const userEmail = watch('userEmail')

  useEffect(() => {
    if (!stripe || !amount) return
    setPaymentRequestAvailable(true)
  }, [stripe, amount])

  useEffect(() => {
    if (!amount) return
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

  const onClick = ({ resolve: resolve }: any) => {
    const options = {
      emailRequired: true,
    }
    resolve(options)
  }

  const onSubmit = async (
    isPayByCard: boolean
  ): Promise<JSX.Element | undefined> => {
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

    posthog.identify(userEmail)
    if (isPayByCard) {
      posthog.capture('Pay by card')
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

  const handlePaypalSuccess = (details: any) => {
    console.log('🚀 ~ Paypal success:', details)
    router.push('/payment-success?amount=' + amount)
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

  return (
    <>
      {deviceType === 'desktop' && (
        <>
          {/* <Card className='mb-6'>
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
          </Card> */}
          <Card className='mb-6'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between gap-6'>
                {/* Secure Payment Text */}
                <h2 className='md:text-[20px] text-[15px] font-semibold whitespace-nowrap'>
                  Secure Payment
                </h2>

                {/* Payment Icons */}
                <div className='flex flex-wrap items-center justify-start gap-1'>
                  {paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded h-[22px] flex items-center justify-center'
                    >
                      <Image
                        width={30}
                        height={12}
                        src={method.src}
                        alt={method.alt}
                        className={`w-[30px] ${
                          method.alt === 'paypal' ? 'h-[12px]' : 'h-auto '
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4'></div>
              {/* Show Google Pay / Apple Pay Button if available */}
              {paymentRequestAvailable && deviceType == 'desktop' && (
                <div className='mb-4 justify-center gap-2 hidden md:flex w-full'>
                  <ExpressCheckoutElement
                    onClick={(resolve) =>
                      handleSubmit(() => onClick(resolve))()
                    }
                    onConfirm={() => onSubmit(false)}
                    options={expressCheckoutOptions}
                    className={`w-full gap-4 h-[40px] mb-0 ${
                      isExpressCheckout ? 'block' : 'hidden'
                    }`}
                    onReady={(element) => {
                      if (element.availablePaymentMethods?.link) {
                        setIsExpressCheckout(false)
                      }
                    }}
                  />
                  <PaypalButton
                    amount={amount.toString()}
                    onSuccess={handlePaypalSuccess}
                  />
                </div>
              )}
              <div className='hidden md:flex items-center justify-between'>
                {/* Total Price */}
                <div>
                  <p className='text-gray-500 text-sm mb-2'>Total</p>
                  <p className='text-[40px] leading-[22px] font-semibold'>
                    £{amount ? amount : 0}
                  </p>
                </div>

                {/* Pay Button */}
                <PaymentDrawer
                  errorMessage={errorMessage}
                  handleSubmit={handleSubmit}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  isProcessing={isProcessing}
                  stripe={stripe}
                  onSubmit={onSubmit}
                  setErrorMessage={setErrorMessage}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {deviceType === 'mobile' && (
        <div className='flex items-center justify-between gap-6 mb-[160px]'>
          {/* Secure Payment Text */}
          <h2 className='md:text-[20px] text-[15px] font-semibold whitespace-nowrap'>
            Secure Payment
          </h2>

          {/* Payment Icons */}
          <div className='flex flex-wrap items-center justify-start gap-1'>
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className='px-2 py-1 bg-[#e9e9e9] text-[#9c9c9c] rounded h-[22px] flex items-center justify-center'
              >
                <Image
                  width={30}
                  height={12}
                  src={method.src}
                  alt={method.alt}
                  className={`w-[30px] ${
                    method.alt === 'paypal' ? 'h-[12px]' : 'h-auto '
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {paymentRequestAvailable && deviceType === 'mobile' && (
        <div className='fixed block md:hidden bottom-0 left-0 w-full border shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.12)] rounded-t-xl p-4 bg-white'>
          {/* Payment Methods */}
          <div className='flex justify-between items-center flex-wrap gap-4 mb-3 w-full'>
            <ExpressCheckoutElement
              onClick={(resolve) => handleSubmit(() => onClick(resolve))()}
              onConfirm={() => onSubmit(false)}
              options={expressCheckoutOptions}
              className={`w-full gap-4 h-[40px] mb-0 ${
                isExpressCheckout ? 'block' : 'hidden'
              }`}
              onReady={(element) => {
                if (element.availablePaymentMethods?.link) {
                  setIsExpressCheckout(false)
                }
              }}
            />
            <PaypalButton
              amount={amount.toString()}
              onSuccess={handlePaypalSuccess}
            />
          </div>
          {/* Total & Pay Button */}
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-500 text-sm'>Total</p>
              <p className='text-2xl font-bold'>£{amount ? amount : 0}</p>
            </div>

            <PaymentDrawer
              errorMessage={errorMessage}
              handleSubmit={handleSubmit}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isProcessing={isProcessing}
              stripe={stripe}
              onSubmit={onSubmit}
              setErrorMessage={setErrorMessage}
              setIsProcessing={setIsProcessing}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutPage
