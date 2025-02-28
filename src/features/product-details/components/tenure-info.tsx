'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import posthog from 'posthog-js'
import { SubmitHandler, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import useDeviceType from '@/hooks/use-device-type'

import { productDetailsSchema } from '@/features/product-details/schema'
import { useAppDispatch } from '@/store/hook'
import { setSelectedAddress, setTenureInfo } from '@/store/slices/address-slice'

const TenureInfo = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    formState: { errors },
    setValue,
    control,
    watch,
    handleSubmit,
    getValues,
  } = useFormContext<z.infer<typeof productDetailsSchema>>()

  const selectedTenure = getValues('tenure')

  const deviceType = useDeviceType()

  const onSubmit: SubmitHandler<z.infer<typeof productDetailsSchema>> = (
    data
  ) => {
    dispatch(
      setTenureInfo({
        tenure: data.tenure,
        titleNumber: data.title_number ? data.title_number : undefined,
      })
    )
    dispatch(
      setSelectedAddress({
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
      })
    )
    posthog.capture('Search document')
    router.push(`/search-result`)
  }

  return (
    <>
      <Card className={`md:mb-4 mb-[160px]`}>
        <CardHeader className='md:text-[30px] text-[15px] leading-[15px] font-medium'>
          Tenure *
        </CardHeader>
        <CardContent>
          <RadioGroup
            className='flex sm:items-center items-start sm:gap-4 gap-2 flex-wrap'
            defaultValue={watch('tenure')}
            onValueChange={(value) =>
              setValue('tenure', value as 'freehold' | 'leasehold' | 'not-sure')
            }
          >
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                value='freehold'
                id='freehold'
                className={`peer ${
                  selectedTenure === 'freehold'
                    ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                    : 'text-[#000] border-[#000]'
                }`}
              />
              <Label
                htmlFor='freehold'
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal cursor-pointer ${
                  selectedTenure === 'freehold'
                    ? 'text-[#28A745]'
                    : 'text-[#000000]'
                }`}
              >
                Freehold
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                value='leasehold'
                id='leasehold'
                className={`peer ${
                  selectedTenure === 'leasehold'
                    ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                    : 'text-[#000] border-[#000]'
                }`}
              />
              <Label
                htmlFor='leasehold'
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal cursor-pointer ${
                  selectedTenure === 'leasehold'
                    ? 'text-[#28A745]'
                    : 'text-[#000000]'
                }`}
              >
                Leasehold
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <RadioGroupItem
                value='not-sure'
                id='not-sure'
                className={`peer ${
                  selectedTenure === 'not-sure'
                    ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                    : 'text-[#000] border-[#000]'
                }`}
              />
              <Label
                htmlFor='not-sure'
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal cursor-pointer ${
                  selectedTenure === 'not-sure'
                    ? 'text-[#28A745]'
                    : 'text-[#000000]'
                }`}
              >
                Not Sure
              </Label>
            </div>
          </RadioGroup>
          {errors.tenure && (
            <p className='text-red-500 text-sm'>
              {errors.tenure.message as string}
            </p>
          )}
          <div className='mt-4'>
            <FormField
              control={control}
              name='title_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter Title Number (If known)'
                      {...field}
                      type='number'
                      className={`w-full border bg-white mt-2 h-[44px] rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {deviceType === 'desktop' && (
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col gap-2 items-start justify-start mb-6'>
              <FormField
                control={control}
                name='agreeTerms'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        className='data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        I agree to the{' '}
                        <Link
                          className='text-[#89c120] font-bold'
                          href='/terms-conditions'
                          target='_blank'
                        >
                          Terms
                        </Link>{' '}
                        and{' '}
                        <Link
                          className='text-[#89c120] font-bold'
                          href='/privacy-policy'
                          target='_blank'
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {errors.agreeTerms && (
                <p className='text-red-500 text-xs'>
                  {errors.agreeTerms.message as string}
                </p>
              )}
            </div>
            <Button
              type='button'
              onClick={handleSubmit(onSubmit)}
              className='w-full bg-green-600 hover:bg-green-700'
            >
              Find Title Documents Now →
            </Button>
          </CardContent>
        </Card>
      )}
      {deviceType === 'mobile' && (
        <div className='fixed bottom-0 left-0 w-full bg-white shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.12)] p-4 border-t flex flex-col items-start rounded-t-[12px] '>
          <div className='flex flex-col gap-2 items-start justify-start '>
            <FormField
              control={control}
              name='agreeTerms'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      className='data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      I agree to the{' '}
                      <Link
                        className='text-[#89c120] font-bold'
                        href='/terms-conditions'
                        target='_blank'
                      >
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link
                        className='text-[#89c120] font-bold'
                        href='/privacy-policy'
                        target='_blank'
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {errors.agreeTerms && (
              <p className='text-red-500 text-xs'>
                {errors.agreeTerms.message as string}
              </p>
            )}
          </div>
          <div className='border-t w-full border-[#000000] opacity-10 my-4'></div>
          <Button
            type='button'
            onClick={handleSubmit(onSubmit)}
            className='w-full bg-green-600 hover:bg-green-700'
          >
            Find Title Documents Now →
          </Button>
        </div>
      )}
    </>
  )
}

export default TenureInfo
