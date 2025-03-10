import { Metadata } from 'next'
import React from 'react'
import PrivacyPolicy from '@/features/privacy-policy/components'

export const generateMetadata = (): Metadata => {
  return {
    title: 'Privacy Policy - Land Registry',
    description: 'This is the privacy policy page of Land Registry.',
  }
}

const Page = () => {
  return <PrivacyPolicy/>
}

export default Page
