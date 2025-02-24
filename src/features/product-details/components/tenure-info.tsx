import { useFormContext } from 'react-hook-form'

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

const TenureInfo = () => {
  const {
    formState: { errors },
    setValue,
    control,
    watch,
    handleSubmit,
  } = useFormContext()

  const selectedTenure = watch('tenure')

  const deviceType = useDeviceType()

  return (
    <>
      <Card className='mb-4'>
        <CardHeader className='md:text-[30px] text-[15px] leading-[15px] font-medium'>
          Tenure *
        </CardHeader>
        <CardContent>
          <RadioGroup
            className='flex space-x-6'
            onValueChange={(value) => setValue('tenure', value)}
          >
            <div className='flex items-center space-x-2'>
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
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal ${
                  selectedTenure === 'freehold'
                    ? 'text-[#28A745]'
                    : 'text-[#000000]'
                }`}
              >
                Freehold
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
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
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal ${
                  selectedTenure === 'leasehold'
                    ? 'text-[#28A745]'
                    : 'text-[#000000]'
                }`}
              >
                Leasehold
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
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
                className={`md:text-[20px] text-[15px] leading-[30px] font-normal ${
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
                      className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0`}
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
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        I agree to the{' '}
                        <span className='text-black'>
                          Terms and Privacy Policy
                        </span>
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
              onClick={handleSubmit((data) => console.log(data))}
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
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>
                      I agree to the{' '}
                      <span className='text-black'>
                        Terms and Privacy Policy
                      </span>
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
            onClick={handleSubmit((data) => console.log(data))}
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
