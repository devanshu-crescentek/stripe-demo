'use client'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import convertToSubCurrency from '@/lib/convertToSubCurrency'
import CheckOutPage from '@/components/CheckOutPage'


if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Home() {
  const amount = 49.99
 
  return (
    <main className='max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500'>
      <div className='mb-10'>
        <h1 className='text-4xl font-extrabold mb-2'>Demo Product</h1>
        <h2 className='text-2xl'>
          has requested
          <span className='font-bold'>${amount}</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          appearance:{
            theme: 'stripe',
          },
          amount: convertToSubCurrency(amount),//cents
          currency: 'usd',
          mode: 'payment',
        }}
      >
        <CheckOutPage amount={amount} />
      </Elements>
    </main>
  )
}
