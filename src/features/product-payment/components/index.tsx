'use client'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import * as z from 'zod'

import { loadStripe } from '@stripe/stripe-js'
import { Edit } from 'lucide-react'
import { Elements } from '@stripe/react-stripe-js'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'

import CheckoutPage from '@/features/product-payment/components/checkout-page'

import convertToSubCurrency from '@/lib/convertToSubCurrency'


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const documents = [
  {
    id: 'title-register',
    name: 'Title Register',
    price: 19.95,
    required: true,
    description:
      'Shows property ownership, description, and any restrictive covenants. For a visual of the land, consider purchasing the Title Plan.',
  },
  {
    id: 'title-plan',
    name: 'Title Plan',
    price: 19.95,
    required: false,
    description:
      'A visual representation of the property or land in a registered title. Consider purchasing the Title Register for details.',
  },
  {
    id: 'conveyancing-pack',
    name: 'Conveyancing Pack',
    price: 49.95,
    required: false,
    description:
      'The pack includes all available Lease Deeds, Transfer Deeds, Conveyancing Deeds, and Charges for the selected property.',
  },
]

const schema = z.object({
  selectedDocs: z
    .array(z.string())
    .min(1, 'Please select at least one document'),
  userEmail: z
    .string()
    .email({
      message: 'Please enter a valid email address.',
    })
    .min(1, 'Please enter your email address.'),
  delivery: z
    .enum(['standard', 'express'], {
      required_error: 'Please select an option.',
    })
    .default('standard'),
})

const PaymentSection = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedDocs: ['title-register'],
      delivery: 'standard',
      userEmail: '',
    },
  })

  const {
    setValue,
    formState: { errors },
  } = form

  const selectedDocs = form.watch('selectedDocs')
  const selectedDelivery = form.watch('delivery')

  const totalAmount =
    documents
      .filter((doc) => selectedDocs.includes(doc.id))
      .reduce((sum, doc) => sum + doc.price, 0) +
    (selectedDelivery === 'express' ? 10 : 0)


  return (
    <>
      <Form {...form}>
        <FormProvider {...form}>
          <form>
            <div className='h-full mb-10'>
              <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
                <div className=''>
                  <Card className='mb-6'>
                    <CardContent className='p-6'>
                      <div className='flex items-center space-x-2 mb-4'>
                        <Image
                          src='/thumb.svg'
                          alt='Check'
                          width={41}
                          className='md:w-[41px] md:h-[62px] w-[27px] h-[40px]'
                          height={62}
                        />
                        <h2 className='md:text-[40px] md:leading-[50px] text-[18px] leading-[23px] font-medium text-[#1E1E1E]'>
                          We&apos;ve found the following documents for the
                          address
                        </h2>
                      </div>

                      {/* Address */}
                      <div className='flex items-start justify-between'>
                        <p className='text-[#0B0C0C] md:text-[20px] text-[18px] leading-[30px] font-normal'>
                          24 Boughton Rd,
                          <br className='md:hidden block' />
                          Wick Hill’ CA,
                          <br className='md:hidden block' />
                          RG40 9BL
                          <br />
                          Title Number: 13456
                        </p>
                        <Button
                          className='bg-[#28A745] rounded-[4px] md:w-[115px] w-[94px] md:h-[49px] h-[31px] font-normal  md:text-[20px] text-[18px] leading-[30px] md:[&_svg]:size-6 [&_svg]:size-4'
                          disabled
                        >
                          <Edit /> Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className='mb-6'>
                    <CardHeader className='font-semibold md:text-[30px] text-[18px] leading-[23px] text-[#222222]'>
                      Select Your Documents
                    </CardHeader>
                    <CardContent>
                      <div className='hidden md:block'>
                        {documents.map((doc) => (
                          <FormField
                            key={doc.id}
                            control={form.control}
                            name='selectedDocs'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(doc.id)}
                                    className='h-7 w-7 data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                                    onCheckedChange={() => {
                                      field.onChange(
                                        field.value.includes(doc.id)
                                          ? field.value.filter(
                                              (id) => id !== doc.id
                                            )
                                          : [...field.value, doc.id]
                                      )
                                    }}
                                  />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel className='text-[20px] font-semibold leading-[30px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                    {doc.name} - £{doc.price}
                                  </FormLabel>
                                  <FormDescription className='text-[20px] leading-[30px] text-[#6B6B6B] font-normal'>
                                    {doc.description}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        ))}
                        <FormMessage>
                          {form.formState.errors.selectedDocs?.message}
                        </FormMessage>
                      </div>
                      <div className='block md:hidden'>
                        {documents.map((doc) => (
                          <FormField
                            key={doc.id}
                            control={form.control}
                            name='selectedDocs'
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border py-4'>
                                <div className='space-y-1 leading-none'>
                                  <FormLabel className='font-semibold text-[18px] mb-2'>
                                    <p className='font-semibold text-[18px] mb-2'>
                                      {doc.name}
                                    </p>
                                  </FormLabel>
                                  <FormDescription className='text-sm text-gray-600'>
                                    {doc.description}
                                  </FormDescription>
                                </div>
                                <FormLabel className='font-semibold text-[20px]'>
                                  £{doc.price.toFixed(2)}
                                </FormLabel>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(doc.id)}
                                    className='h-7 w-7 data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                                    onCheckedChange={() => {
                                      field.onChange(
                                        field.value.includes(doc.id)
                                          ? field.value.filter(
                                              (id) => id !== doc.id
                                            )
                                          : [...field.value, doc.id]
                                      )
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                        <FormMessage>
                          {form.formState.errors.selectedDocs?.message}
                        </FormMessage>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className=''>
                  <Card className='mb-6'>
                    <CardContent className='p-6'>
                      <RadioGroup
                        defaultValue={form.getValues('delivery')}
                        onValueChange={(value) =>
                          setValue(
                            'delivery',
                            value === 'standard' ? 'standard' : 'express'
                          )
                        }
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='standard'
                            id='r2'
                            className={`peer ${
                              selectedDelivery === 'standard'
                                ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                                : 'text-[#000] border-[#000]'
                            } md:h-5 h-[18px] md:w-5 w-[18px] md:[&_svg]:h-[12px] [&_svg]:h-[10px] md:[&_svg]:w-[12px] [&_svg]:w-[10px]`}
                          />
                          <Label
                            htmlFor='r2'
                            className={`font-semibold flex items-center justify-between w-full cursor-pointer md:text-[20px] text-[16px] md:leading-[23px] leading-[30px] ${
                              selectedDelivery === 'standard'
                                ? 'text-[#28A745]'
                                : 'text-[#000000]'
                            }`}
                          >
                            <div className='flex items-center justify-between w-full cursor-pointer'>
                              Standard
                              <span
                                className={`font-medium md:text-[20px] text-[16px] leading-[30px] `}
                                onClick={() => setValue('delivery', 'standard')}
                              >
                                Free
                              </span>
                            </div>
                          </Label>
                        </div>
                        {selectedDelivery === 'standard' && (
                          <div className='mt-2 text-[#6B6B6B]'>
                            <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px]'>
                              Standard delivery are sent to you email within 1
                              UK business day.
                            </p>

                            <FormField
                              control={form.control}
                              name='userEmail'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type='email'
                                      placeholder='Enter Your Email Address'
                                      {...field}
                                      className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                                        form.formState.errors.userEmail
                                          ? 'border-red-500'
                                          : ''
                                      }`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        <div className='border-t border-[#000000] opacity-10 my-4'></div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem
                            value='express'
                            id='r3'
                            className={`peer ${
                              selectedDelivery === 'express'
                                ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                                : 'text-[#000] border-[#000]'
                            } md:h-5 h-[18px] md:w-5 w-[18px] md:[&_svg]:h-[12px] [&_svg]:h-[10px] md:[&_svg]:w-[12px] [&_svg]:w-[10px]`}
                          />
                          <Label
                            htmlFor='r3'
                            className={`font-semibold flex items-center justify-between w-full cursor-pointer md:text-[20px] text-[16px] md:leading-[23px] leading-[30px] ${
                              selectedDelivery === 'express'
                                ? 'text-[#28A745]'
                                : 'text-[#000000]'
                            }`}
                          >
                            <div className='flex items-center justify-between w-full cursor-pointer'>
                              Express
                              <span
                                className={`font-medium md:text-[20px] text-[16px] leading-[30px] `}
                                onClick={() => setValue('delivery', 'express')}
                              >
                                £10.00
                              </span>
                            </div>
                          </Label>
                        </div>
                        {selectedDelivery === 'express' && (
                          <div className='mt-2 text-[#6B6B6B]'>
                            <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px]'>
                              Standard delivery are sent to you email within 1
                              UK business day.
                            </p>

                            <FormField
                              control={form.control}
                              name='userEmail'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type='email'
                                      placeholder='Enter Your Email Address'
                                      {...field}
                                      className={`w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
                                        form.formState.errors.userEmail
                                          ? 'border-red-500'
                                          : ''
                                      }`}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </RadioGroup>

                      {errors.delivery && (
                        <p className='text-red-500 text-sm'>
                          {errors.delivery.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          borderRadius: '4px',
                        },
                      },
                      amount: convertToSubCurrency(
                        totalAmount ? totalAmount : 1
                      ), //cents
                      currency: 'usd',
                      mode: 'payment',
                    }}
                  >
                    <CheckoutPage amount={totalAmount} />
                  </Elements>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </Form>
    </>
  )
}

export default PaymentSection
