import React from 'react'
import { Card, CardHeader } from '@/components/ui/card'

const AddressInfo = () => {
  return (
    <Card>
      <CardHeader>
        <h1 className='md:text-[40px] text-[24px] leading-[30px] font-semibold mb-4'>Property Details</h1>
        <p className='text-[#7C7C7C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal'>
          Enter the property address to obtain documents. You can search for any
          deeds, ownership not required.
        </p>
      </CardHeader>
    </Card>
  )
}

export default AddressInfo
