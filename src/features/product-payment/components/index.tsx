/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect, useRef } from 'react'

import { redirect, useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Edit, Info } from 'lucide-react'
import posthog from 'posthog-js'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import CheckoutPage from '@/features/product-payment/components/checkout-page'

import convertToSubCurrency from '@/lib/convertToSubCurrency'
import { useAppSelector } from '@/store/hook'
import { validEmailRegex } from '@/lib/utils'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const schema = z.object({
  selectedDocs: z
    .array(z.number())
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
  const cardRef = useRef<HTMLDivElement | null>(null)
  const emailRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const queryParams = useAppSelector((state) => state.queryParams.params)
  const { selectedAddress, tenure_info, documents } =
    useAppSelector((state) => state.address) || false

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedDocs: [71, 72],
      delivery: queryParams?.ft === 'true' ? 'express' : 'standard',
      userEmail: '',
    },
  })

  const {
    setValue,
    formState: { errors },
  } = form

  const selectedDocs = form.watch('selectedDocs')
  const selectedDelivery = form.watch('delivery')

  useEffect(() => {
    if (selectedDelivery === 'express') {
      posthog.capture('Selected express delivery', {
        selectedDelivery,
      })
    }
    if (selectedDelivery === 'standard') {
      posthog.capture('Selected standard delivery', {
        selectedDelivery,
      })
    }
  }, [])

  useEffect(() => {
    if (selectedDocs.length > 0) {
      documents
        .filter((doc) => selectedDocs.includes(doc.id))
        .forEach((doc) => {
          posthog.capture(`Selected ${doc.name}`)
        })
    }
  }, [form])

  useEffect(() => {
    if (form.formState.errors.selectedDocs) {
      // Only apply effect on screens smaller than 1024px
      if (window.innerWidth < 1024 && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Check if the card is already visible in the viewport
        const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight

        if (!isFullyVisible) {
          setTimeout(() => {
            cardRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
          }, 1000)
        }
      }
    }
  }, [form.formState.errors.selectedDocs])

  useEffect(() => {
    if (form.formState.errors.userEmail) {
      if (selectedDelivery === 'express') {
        const input = document.getElementById('expressEmail')
        if (input) {
          input.focus()
        }
      }
      if (selectedDelivery === 'standard') {
        const input = document.getElementById('standardEmail')
        if (input) {
          input.focus()
        }
      }
      // Only apply effect on screens smaller than 1024px
      if (window.innerWidth < 1024 && emailRef.current) {
        const rect = emailRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Check if the card is already visible in the viewport
        const isFullyVisible = rect.top >= 0 && rect.bottom <= windowHeight

        if (!isFullyVisible) {
          emailRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
    }
  }, [form.formState.errors.userEmail])

  if (!selectedAddress) {
    return redirect('/')
  }

  const fastTrackDoc = documents.find((doc) => doc.name === 'Fast Track')

  const totalAmount =
    documents
      .filter((doc) => selectedDocs.includes(doc.id))
      .reduce((sum, doc) => sum + doc.price, 0) +
    (selectedDelivery === 'express' ? 9.99 : 0)

  const goToDetailsPage = () => {
    posthog.capture('Edit address on payment page')
    router.push('/details?isEdit=true')
  }

  return (
    <>
      <Form {...form}>
        <FormProvider {...form}>
          <form className='flex-1 mb-10'>
            <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
              <div className=''>
                <Card className='mb-6'>
                  <CardContent className='p-6'>
                    {/* Address */}
                    <div className='flex items-start justify-between'>
                      <p className='text-[#0B0C0C] md:text-[20px] text-[18px] leading-[30px] font-normal'>
                        {selectedAddress.address &&
                          `${selectedAddress.address}, `}
                        {selectedAddress.city && `${selectedAddress.city}, `}
                        {selectedAddress.country &&
                          `${selectedAddress.country}`}
                        <br />
                        {selectedAddress.postalCode &&
                          selectedAddress.postalCode}
                        <br />
                        {tenure_info?.titleNumber && (
                          <>Title Number: {tenure_info.titleNumber}</>
                        )}
                      </p>
                      <Button
                        type='button'
                        className='bg-[#28A745] hover:bg-green-700 rounded-[4px] md:w-[115px] w-[94px] md:h-[49px] h-[31px] font-normal  md:text-[20px] text-[18px] leading-[30px] md:[&_svg]:size-6 [&_svg]:size-4'
                        onClick={goToDetailsPage}
                      >
                        <Edit /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`mb-6 transition-all duration-500 ${
                    form.formState.errors.selectedDocs
                      ? 'border border-red-500 shadow-md'
                      : 'border'
                  }`}
                  ref={cardRef}
                >
                  <CardHeader className='font-semibold md:text-[30px] text-[18px] leading-[23px] text-[#222222]'>
                    Select Your Documents
                  </CardHeader>
                  <CardContent>
                    <div className='hidden md:block'>
                      {documents
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => a.price - b.price) // Sort by price in ascending order
                        .map((doc) => {
                          if (doc.name === 'Fast Track') {
                            return null
                          }
                          return (
                            <FormField
                              key={doc.id}
                              control={form.control}
                              name='selectedDocs'
                              render={({ field }) => {
                                const isChecked = field.value.includes(doc.id)
                                return (
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

                                          if (isChecked) {
                                            posthog.capture(
                                              `De-Selected ${doc.name}`
                                            )
                                          } else {
                                            posthog.capture(
                                              `Selected ${doc.name}`
                                            )
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                      <FormLabel className='text-[20px] font-semibold leading-[30px] text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'>
                                        {doc.name} - £{doc.price}
                                      </FormLabel>
                                      <FormDescription className='text-[20px] leading-[30px] text-[#6B6B6B] font-normal'>
                                        {doc.description}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                        })}
                      <FormMessage>
                        {form.formState.errors.selectedDocs?.message}
                      </FormMessage>
                    </div>
                    <div className='block md:hidden'>
                      {documents
                        .slice() // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => a.price - b.price) // Sort by price in ascending orderF
                        .map((doc) => {
                          if (doc.name === 'Fast Track') {
                            return null
                          }
                          return (
                            <FormField
                              key={doc.id}
                              control={form.control}
                              name='selectedDocs'
                              render={({ field }) => {
                                const isChecked = field.value.includes(doc.id)
                                return (
                                  <FormItem className='flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border py-4 gap-4'>
                                    <div className='leading-none cursor-pointer flex items-start gap-2 w-3/4'>
                                      <FormLabel className='font-semibold text-[18px] text-black w-fit leading-[25px] flex'>
                                       <span className='mr-2'>{doc.name}</span>{' '}
                                        <span
                                          className='relative group mt-1'
                                          onClick={(e) => {
                                            e.preventDefault()
                                          }}
                                        >
                                          <Info className='w-5 h-5 text-[#868686] cursor-pointer' />
                                          <div className='z-10 absolute left-1/2 transform -translate-x-1/2 top-5 hidden group-hover:flex w-[250px] bg-white border border-[#868686] text-sm px-3 py-2 rounded-md shadow-md break-words font-normal'>
                                            {doc.description ||
                                              'No description available'}
                                          </div>
                                        </span>
                                      </FormLabel>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                      <FormLabel className='font-semibold text-[20px] text-black'>
                                        £{doc.price.toFixed(2)}
                                      </FormLabel>
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value.includes(doc.id)}
                                          className='sm:h-7 sm:w-7 h-[19px] w-[19px] data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                                          onCheckedChange={() => {
                                            field.onChange(
                                              field.value.includes(doc.id)
                                                ? field.value.filter(
                                                    (id) => id !== doc.id
                                                  )
                                                : [...field.value, doc.id]
                                            )

                                            if (isChecked) {
                                              posthog.capture(
                                                `De-Selected ${doc.name}`
                                              )
                                            } else {
                                              posthog.capture(
                                                `Selected ${doc.name}`
                                              )
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                        })}
                      <FormMessage>
                        {form.formState.errors.selectedDocs?.message}
                      </FormMessage>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className=''>
                <Card className='mb-6' ref={emailRef}>
                  <CardContent className='p-6'>
                    <RadioGroup
                      defaultValue={form.getValues('delivery')}
                      onValueChange={(value) =>
                        setValue(
                          'delivery',
                          value === 'standard' ? 'standard' : 'express'
                        )
                      }
                      className={`flex space-y-1 ${
                        queryParams?.ft === 'true'
                          ? 'flex-col-reverse'
                          : 'flex-col'
                      }`}
                    >
                      <div>
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
                              Standard Delivery
                              <span
                                className='font-medium md:text-[20px] text-[16px]  leading-[30px] flex flex-col items-center'
                                onClick={() => setValue('delivery', 'standard')}
                              >
                                Free
                              </span>
                            </div>
                          </Label>
                        </div>
                        {selectedDelivery === 'standard' && (
                          <div className='text-[#6B6B6B]'>
                            <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px] mb-4'>
                              Your documents will be delivered via email within
                              <b className='text-[#28A745]'>
                                {' '}
                                1 business day
                              </b>{' '}
                              (Monday-Friday, 8 AM-5 PM). If you don’t receive
                              your order, please check your junk or spam folder.
                            </p>

                            <FormField
                              control={form.control}
                              name='userEmail'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type='email'
                                      id='standardEmail'
                                      placeholder='Enter Your Email Address'
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        if (
                                          e.target.value.length > 0 &&
                                          e.target.value.match(validEmailRegex)
                                        ) {
                                          posthog.capture('Enter Email id', {
                                            email: e.target.value,
                                          })
                                        }
                                      }}
                                      className={`w-full border bg-white mt-2 rounded-md px-4 py-2 h-[44px] text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
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
                      </div>
                      <div className='border-t border-[#000000] opacity-10 my-4'></div>
                      <div>
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
                              Express Delivery
                              <span
                                className={`font-medium md:text-[20px] text-[16px] leading-[30px] flex items-center flex-col`}
                                onClick={() => setValue('delivery', 'express')}
                              >
                                £{fastTrackDoc?.price || 9.99}
                              </span>
                            </div>
                          </Label>
                        </div>
                        {selectedDelivery === 'express' && (
                          <div className='text-[#6B6B6B]'>
                            <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px] mb-4'>
                              Your documents will be delivered via email within
                              <b className='text-[#28A745]'>
                                {' '}
                                1 business hour
                              </b>{' '}
                              (Monday–Friday, 8 AM–5 PM). If you don’t receive
                              your order, please check your junk or spam folder.
                            </p>

                            <FormField
                              control={form.control}
                              name='userEmail'
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type='email'
                                      id='expressEmail'
                                      placeholder='Enter Your Email Address'
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        if (
                                          e.target.value.length > 0 &&
                                          e.target.value.match(validEmailRegex)
                                        ) {
                                          posthog.capture('Enter Email id', {
                                            email: e.target.value,
                                          })
                                        }
                                      }}
                                      className={`w-full border bg-white mt-2 rounded-md px-4 py-2 h-[44px] text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 ${
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
                      </div>
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
                      totalAmount ? totalAmount : 1000
                    ), //cents
                    currency: 'gbp',
                    mode: 'payment',
                  }}
                >
                  <CheckoutPage amount={totalAmount} />
                </Elements>
              </div>
            </div>
          </form>
        </FormProvider>
      </Form>
    </>
  )
}

export default PaymentSection
