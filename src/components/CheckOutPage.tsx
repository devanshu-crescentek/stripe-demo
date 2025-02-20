'use client'

import { useEffect, useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js'
import convertToSubCurrency from '@/lib/convertToSubCurrency'

const CheckOutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState('')
  const [paymentRequest, setPaymentRequest] =
    useState<stripe.PaymentRequest | null>(null)
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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

  return (
    <form className='bg-white p-2 rounded-md' onSubmit={handleSubmit}>
      {/* Show Google Pay / Apple Pay Button if available */}
      {paymentRequestAvailable && paymentRequest && (
        <div className='mb-4'>
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        </div>
      )}

      {clientSecret && <PaymentElement options={{ layout: 'tabs' }} />}
      {errorMessage && <div>{errorMessage}</div>}
      <button
        className='text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse'
        disabled={isProcessing || !stripe}
      >
        {isProcessing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  )
}

export default CheckOutPage
