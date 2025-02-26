import { Metadata } from 'next'
import React from 'react'
import TermsConditions from '@/features/terms-conditions/components'

export const generateMetadata = (): Metadata => {
  return {
    title: 'Terms & Conditions - Land Registry',
    description: 'This is the terms & conditions page of Land Registry.',
  }
}

const Page = () => {
  return <TermsConditions/>
}

export default Page
