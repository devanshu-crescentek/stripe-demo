'use client'
import { useEffect } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import posthog from 'posthog-js'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import DocCard from '@/features/home/components/doc-card'
import FaqCard from '@/features/home/components/faq-card'
import { postalCodeSchema } from '@/features/home/schema'

import { useGetAddressDetailsMutation } from '@/store/api/get-address'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { resetAddress } from '@/store/slices/address-slice'
import { setQueryParams } from '@/store/slices/query-slice'


const Home = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  const queryParams = useAppSelector((state) => state.queryParams.params)

  useEffect(() => {
    // Convert search params to an object
    const params = Object.fromEntries(searchParams.entries())
    dispatch(setQueryParams(params))
  }, [dispatch, searchParams])

  const methods = useForm<z.infer<typeof postalCodeSchema>>({
    resolver: zodResolver(postalCodeSchema),
    defaultValues: {
      postalCode: '',
    },
  })
  const postalCode = methods.watch('postalCode')

  useEffect(() => {
    dispatch(resetAddress())
    posthog.reset(true)
  }, [dispatch])

  useEffect(() => {
    if (postalCode?.length > 0) {
      const timeout = setTimeout(() => {
        posthog.capture('Enter Postcode', { postalCode })
      }, 2000)

      return () => clearTimeout(timeout) // Cleanup function to reset timeout on changes
    }
  }, [postalCode])

  const [temGetAddressDetails, { isLoading }] = useGetAddressDetailsMutation()

  const handleNavigate = () => {
    router.push('/details')
  }

  const handleOnSubmit = async (data: z.infer<typeof postalCodeSchema>) => {
    try {
      const res = await temGetAddressDetails(data.postalCode).unwrap()
      posthog.capture('Search Postcode', { postalCode: data.postalCode })
      if (res.length > 0) {
        router.push(`/search-postalCode?postalCode=${data.postalCode}`)
      } else {
        methods.setError('postalCode', {
          type: 'manual',
          message: 'No records found',
        })
      }
    } catch (error) {
      console.log('🚀 ~ handleOnSubmit ~ error:', error)
      methods.setError('postalCode', {
        type: 'manual',
        message: 'Something went wrong',
      })
    }
  }

  return (
    <div className='h-full'>
      <div className='md:py-16 sm:py-10 py-9 bg-white'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
            <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12'>
              <div className='bg-[#F3F2F1] rounded-lg text-start max-w-3xl min-h-[129px] flex justify-center items-center p-[20px]'>
                {queryParams?.ft === 'true' || queryParams?.ct ? (
                  <p className='md:text-[20px] text-[16px] md:leading-[30px] leading-[25px] font-semibold'>
                    It will change
                  </p>
                ) : (
                  <p className='md:text-[20px] text-[16px] md:leading-[30px] leading-[25px] font-semibold'>
                    Find information and access official electronic copies of
                    title deeds and documents for millions of properties in
                    <span className='text-green-500'>
                      {' '}
                      England, Wales, Northern Ireland & Scotland.
                    </span>
                  </p>
                )}
              </div>
              <h2 className='md:text-[40px] text-[30px] font-semibold leading-[30px] md:mb-10 mb-2 mt-10'>
                Search by Postcode
              </h2>
              <div className='md:mt-10 mt-4 w-full max-w-sm'>
                <FormField
                  control={methods.control}
                  name='postalCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          type='text'
                          {...field}
                          placeholder='Enter your postalCode here ....'
                          className={`mt-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none ${
                            methods.formState.errors.postalCode
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Help Link */}
                <p className='mt-2 text-[#0d6efd] text-[12px] font-bold mb-6'>
                  <Link
                    href='/details'
                    className='underline'
                    onClick={() => {
                      posthog.capture('Skip Postcode')
                    }}
                  >
                    Don’t know the Postcode? Enter the address manually &gt;&gt;
                  </Link>
                </p>

                {/* Search Button */}
                <button
                  type='submit'
                  className={`mt-4 w-full bg-green-600 text-[18px] h-[58px] text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 ${
                    isLoading
                      ? 'bg-slate-300 opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      Search Title Document
                      <span>&#8594;</span>
                    </>
                  )}
                </button>

                <p className='mt-[15px] mb-[1.6em] text-[16px] text-gray-600'>
                  By using this service, you agree to the
                  <a href='#' className='text-green-600 mx-1'>
                    terms of service
                  </a>
                  and
                  <a href='#' className='text-green-600 mx-1'>
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='Title Register Deeds'
        cardDes='The Title Register provides all the official particulars relating to ownership of a property, a physical description of the property and restrictive covenants in a written form.'
        pointInfo={[
          {
            title: 'Deeds - Title Register Documents',
            des: 'Displays property or land ownership descriptions, and any available restrictive covenants. We also recommend purchasing the Title Plan,which visually indicates the extent of the registered land.',
          },
        ]}
        btnTitle='Get Title Register Now'
        handleNavigate={handleNavigate}
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Title Plan Deeds'
        cardDes='The Title Plan offers a visual representation, outlining the land’s extent within a registered title. It may also include additional plan references to help identify various parts of the land.'
        pointInfo={[
          {
            title: 'Deeds - Title Plan Documents',
            des: 'Visual depiction of property or land within a registered title. We also recommend purchasing the Title Register, which provides a detailed description of the plan.',
          },
        ]}
        btnTitle='Get Title Plan Now'
        handleNavigate={handleNavigate}
      />
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='Conveyancing Pack'
        cardDes='The pack contains all available; Lease Deeds, Transfer Deeds, Conveyancing Deeds and Charge (Mortgage) documents available for the selected property or land.'
        btnTitle='Get Conveyance Plan Now'
        handleNavigate={handleNavigate}
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Access Land Registry'
        cardDes='Our online Land Registry services are available 24/7 to everyone, including commercial and public organizations as well as individuals. Easily request property and land title deeds through our website and we’ll email electronic copies of the title deed documents to you the same day.'
        cardSubDes='You can also access the Land Registry Title Register and Title Plan on our site, which provide comprehensive details including property boundaries, owner information, a physical description of the property, and specifics like restrictive covenants and easements.'
        btnTitle='Access Registry Documents Now'
        handleNavigate={handleNavigate}
      />
      <DocCard
        cardBgColor='bg-[#F3F2F1]'
        cardTitle='What Are Title Documents?'
        cardDes='The Title Plan may show features (such as parts of the land coloured differently, or edged in various colours) with no explanation on the plan itself, it is therefore often difficult to determine the full extent of the Title deeds. These features will always be explained in the Title Register document.'
        cardSubDes='Such features would usually relate to areas over which the property has a right of way, or areas of land that may have been removed from the Title Plan. We would, therefore, recommend that you purchase the Title Plan & Register at the same time.'
        btnTitle='Get title Documents Now'
        handleNavigate={handleNavigate}
      />
      <DocCard
        cardBgColor='bg-white'
        cardTitle='Access Land Registry Documents Online in 3 Quick and Easy Steps.'
        titleLeading
        cardDes='Access Land Registry documents online in three straightforward steps: First navigate to the ‘Documents’ section. Then, enter the necessary property details and submit your request. The documents will be promptly emailed to you.'
        pointInfo={[
          {
            title: 'Select Your Documents',
            des: 'Purchase Title Plan & Title Register Official Documents.',
          },
          {
            title: 'Complete The Form',
            des: 'Enter the details of the property and make payment.',
          },
          {
            title: 'Access Your Documents',
            des: 'We will process your documents and send them to you via email.',
          },
        ]}
        btnTitle='Get Land Registry Documents'
        handleNavigate={handleNavigate}
      />
      <FaqCard />
    </div>
  )
}

export default Home
