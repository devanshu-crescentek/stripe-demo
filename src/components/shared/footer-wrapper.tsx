'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/shared/footer'

export default function FooterWrapper() {
  const pathname = usePathname()

  // Check if current path is /product-payment
  const hideFooter = pathname === '/product-payment' || pathname === '/details'

  return (
    <div className={hideFooter ? 'hidden md:block' : ''}>
      <Footer />
    </div>
  )
}
