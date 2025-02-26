import React from 'react'
import { Metadata } from 'next'

import FAQ from '@/features/faq/components'

export const generateMetadata = (): Metadata => {
  return {
    title: 'FAQ - Land Registry',
    description: 'This is the FAQ page of Land Registry.',
  }
}


const Page = () => {
  return (
    <FAQ/>
  )
}

export default Page