'use client'

import PaymentSection from '@/components/payment-section'

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
