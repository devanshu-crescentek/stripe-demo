'use client'

import PaymentSection from '@/features/product-payment/components'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
}

export default function Home() {
  return (
    <>
      <PaymentSection />
    </>
  )
}
