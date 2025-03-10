import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { useFormContext } from 'react-hook-form'
import posthog from 'posthog-js'
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
import { useAppSelector } from '@/store/hook'

const AddressInfo = () => {
  const [isEdit, setIsEdit] = useState(true)
  const searchParams = useSearchParams()

  const isEditParams = searchParams.get('isEdit')
  const isCountryError = searchParams.get('isCtError')

  const { control, formState, watch, setError } = useFormContext()
  const { selectedAddress } = useAppSelector((state) => state.address) || {}

  useEffect(() => {
    if (
      !selectedAddress ||
      isEditParams === 'true' ||
      isCountryError === 'true'
    ) {
      setIsEdit(true)
      if (isCountryError === 'true') {
        setError('postalCode', {
          message: 'Please enter a valid postcode',
          type: 'manual',
        })
      }
      return
    }

    const requiredFields: (keyof typeof selectedAddress)[] = [
      'address',
      'city',
      'county',
      'postalCode',
    ]

    setIsEdit(!requiredFields.every((key) => selectedAddress[key]?.length))
  }, [selectedAddress, isEditParams, isCountryError, setError])

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
            <p className='text-[##0B0C0C] md:text-[20px] text-[14px] md:leading-[30px] leading-[21px] font-normal w-full'>
              {watch('address') && `${watch('address')}, `}
              {watch('city') && `${watch('city')}, `}
              {watch('county') && `${watch('county')} `}
              <br />
              {watch('postalCode') && watch('postalCode')}
            </p>
          )}

          {selectedAddress && (
            <Button
              onClick={() => {
                posthog.capture('Edit address on Address page')
                setIsEdit((prev) => !prev)
              }}
              type='button'
              className='bg-[#28A745] hover:bg-green-700 rounded-[4px] md:w-[115px] w-[94px] md:h-[49px] h-[31px] font-normal  md:text-[20px] text-[18px] leading-[30px] md:[&_svg]:size-6 [&_svg]:size-4'
            >
              <Edit /> Edit
            </Button>
          )}
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
                          className={`w-full border bg-white mt-2 h-[44px] rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
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
                          className={`w-full border bg-white mt-2 h-[44px] rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
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
                  name='county'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter County'
                          {...field}
                          className={`w-full border bg-white mt-2 h-[44px] rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                            formState.errors.county ? 'border-red-500' : ''
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
                          className={`w-full border bg-white mt-2 h-[44px] rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
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
