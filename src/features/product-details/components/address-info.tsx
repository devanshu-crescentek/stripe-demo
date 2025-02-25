import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Edit } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const AddressInfo = () => {
  const { control, formState, watch } = useFormContext()
  const [isEdit, setIsEdit] = useState(true)

  return (
    <Card>
      <CardHeader>
        <h1 className='md:text-[40px] text-[24px] leading-[30px] font-semibold'>
          Property Details
        </h1>
      </CardHeader>
      <CardContent>
        <div className='flex items-start justify-between gap-4 mb-4'>
          {isEdit ? (
            <>
              <p className='text-[#7C7C7C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal w-full'>
                Enter the property address to obtain documents. You can search
                for any deeds, ownership not required.
              </p>
            </>
          ) : (
            <>
              <p className='text-[##0B0C0C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal w-full'>
                24 boughton Rd, Wick Hill’ CA, <br />
                RG40 9BL 
                <br />
                {watch('address') && `${watch('address')}, `}
                {watch('city') && `${watch('city')}, `}
                {watch('country') && `${watch('country')}, `}<br/>
                {watch('postalCode') && watch('postalCode')}
              </p>
            </>
          )}

          <Button
            onClick={() => setIsEdit((prev) => !prev)}
            type='button'
            className='bg-[#28A745] hover:bg-green-700 rounded-[4px] md:w-[115px] w-[94px] md:h-[49px] h-[31px] font-normal  md:text-[20px] text-[18px] leading-[30px] md:[&_svg]:size-6 [&_svg]:size-4'
          >
            <Edit /> Edit
          </Button>
        </div>
        {isEdit && (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='mb-4'>
                <FormField
                  control={control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter Address'
                          {...field}
                          className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                            formState.errors.address ? 'border-red-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-4'>
                <FormField
                  control={control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town/City*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='City'
                          {...field}
                          className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                            formState.errors.city ? 'border-red-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-4'>
                <FormField
                  control={control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter County'
                          {...field}
                          className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                            formState.errors.country ? 'border-red-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-4'>
                <FormField
                  control={control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Postcode'
                          {...field}
                          className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                            formState.errors.postalCode ? 'border-red-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default AddressInfo
