'use client'

import { Suspense } from 'react'
import PaymentSuccess from '@/features/product-payment/components/payment-success'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  )
}
