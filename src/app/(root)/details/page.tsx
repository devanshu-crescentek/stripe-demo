import React from 'react'
import ProductDetails from '@/features/product-details/components'

const page = () => {
  return (
    <div className='min-h-screen mt-10'>
      <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
        <ProductDetails />
      </div>
    </div>
  )
}

export default page
