'use client'
import Image from 'next/image'
import { useState } from 'react'

import convertToSubCurrency from '@/lib/convertToSubCurrency'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Edit } from 'lucide-react'
import { Button } from '../ui/button'
import CheckOutPage from './CheckOutPage'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '../ui/input'

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

const PaymentSection = () => {
  const [selectedDocs, setSelectedDocs] = useState(['title-register'])
  const [selected, setSelected] = useState('standard')

  const toggleSelection = (id: string) => {
    setSelectedDocs((prevSelectedDocs) =>
      prevSelectedDocs.includes(id)
        ? prevSelectedDocs.filter((doc) => doc !== id)
        : [...prevSelectedDocs, id]
    )
  }

  const totalAmount =
    documents
      .filter((doc) => selectedDocs.includes(doc.id))
      .reduce((sum, doc) => sum + doc.price, 0) + (selected=== 'express' ? 10 : 0)

  return (
    <>
      <div className='min-h-screen mt-10'>
        <div className='max-w-screen-2xl w-full mx-auto grid lg:grid-cols-2 lg:gap-12 gap-0 px-6'>
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
                    We&apos;ve found the following documents for the address
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
                    <div key={doc.id} className='items-top flex space-x-2 mb-6'>
                      <Checkbox
                        id={doc.id}
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={() => toggleSelection(doc.id)}
                        className='h-7 w-7 data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor={doc.id}
                          className='text-[20px] font-semibold leading-[30px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        >
                          {doc.name} - £{doc.price}
                        </label>
                        <p className='text-[20px] leading-[30px] text-[#6B6B6B] font-normal'>
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='block md:hidden'>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`py-3 rounded-md flex items-start space-x-3 cursor-pointer`}
                    >
                      <div className='flex flex-col items-start justify-between w-full'>
                        <p className='font-semibold text-[18px] mb-2'>
                          {doc.name}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {doc.description}
                        </p>
                      </div>
                      <p className='font-semibold text-[20px]'>
                        £{doc.price.toFixed(2)}
                      </p>
                      <Checkbox
                        id={doc.id}
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={() => toggleSelection(doc.id)}
                        className='h-7 w-7 data-[state=checked]:bg-[#28A745] data-[state=checked]:border-[#28A745] dark:text-foreground'
                      />
                      {/* <div
                        className={`min-w-[20px] w-[20px] min-h-[20px] h-[20px] flex items-center justify-center border rounded-md mt-1 ${
                          selectedDocs.includes(doc.id)
                            ? 'bg-[#28A745] text-white'
                            : 'bg-white'
                        }`}
                      >
                        {selectedDocs.includes(doc.id) && (
                          <Check size={16} className='text-white' />
                        )}
                      </div> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* 
            <h3 className='font-semibold md:text-[30px] text-[18px] leading-[23px] mt-6'>
              Select Your Documents
            </h3>

            <div className='border-t border-dashed border-[#000000] my-4'></div>

            <div className='flex items-start justify-between'>
              <div className=''>
                <p className='font-semibold flex items-center gap-1 text-[18px] leading-[30px]'>
                  Fast Track (1 Hour){' '}
                  <span className='hidden md:block'>- £10.00</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          size={16}
                          className='text-[#000000] cursor-pointer'
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Fast Track processing fee</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className='font-semibold flex items-center gap-1 text-[18px] leading-[30px] md:hidden'>
                  {' '}
                  £10.00
                </p>
              </div>

              <div
                className={`${
                  isToggle ? '!bg-[#28A745]' : 'bg-[#f0f0f0]'
                } w-[57px] h-[30px] px-[0.150rem] cursor-pointer py-[0.160rem] border transition-colors duration-500 border-[#e5eaf2]  rounded-full relative`}
                onClick={() => setIsToggle(!isToggle)}
              >
                <div
                  className={`${
                    isToggle
                      ? 'translate-x-[27px] !bg-white'
                      : 'translate-x-[1px]'
                  } w-[23px] h-[23px] pb-1 transition-all duration-500 rounded-full bg-[#fff]`}
                  style={{ boxShadow: '1px 2px 5px 2px rgb(0,0,0,0.1)' }}
                ></div>
              </div>
            </div> */}
          </div>
          <div className=''>
            <Card className='mb-6'>
              <CardContent className='p-6'>
                <RadioGroup defaultValue='standard' onValueChange={setSelected}>
                  {/* Standard Delivery */}
                  <div
                    className='border rounded-lg transition-all duration-200 ease-in-out peer-checked:border-green-500 peer-checked:bg-green-50 cursor-pointer'
                    onClick={() => setSelected('standard')}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value='standard'
                          id='standard'
                          checked={selected === 'standard'}
                          onChange={() => setSelected('standard')}
                          className={`peer ${
                            selected === 'standard'
                              ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                              : 'text-[#000] border-[#000]'
                          } md:h-5 h-[18px] md:w-5 w-[18px] md:[&_svg]:h-[12px] [&_svg]:h-[10px] md:[&_svg]:w-[12px] [&_svg]:w-[10px]`}
                        />
                        <Label
                          htmlFor='standard'
                          className={`font-semibold md:text-[20px] text-[16px] md:leading-[23px] leading-[30px] ${
                            selected === 'standard'
                              ? 'text-[#28A745]'
                              : 'text-[#000000]'
                          }`}
                        >
                          Standard Delivery
                        </Label>
                      </div>
                      <span
                        className={`font-medium md:text-[20px] text-[16px] leading-[30px] ${
                          selected === 'standard'
                            ? 'text-[#28A745]'
                            : 'text-[#000000]'
                        }`}
                      >
                        FREE
                      </span>
                    </div>
                    {selected === 'standard' && (
                      <div className='mt-2 text-[#6B6B6B]'>
                        <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px]'>
                          Standard delivery are sent to you email within 1 UK
                          business day.
                        </p>
                        <Input
                          type='email'
                          placeholder='Enter Your Email Address'
                          className='w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0 '
                        />
                      </div>
                    )}
                  </div>
                  <div className='border-t border-[#000000] opacity-10 my-4'></div>
                  {/* Express Delivery */}
                  <div
                    className='border rounded-lg transition-all duration-200 ease-in-out cursor-pointer'
                    onClick={() => setSelected('express')}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem
                          value='express'
                          id='express'
                          checked={selected === 'express'}
                          onChange={() => setSelected('selected')}
                          className={`peer ${
                            selected === 'express'
                              ? 'text-[#28A745] border-[#28A745] [&_svg]:fill-[#28A745]'
                              : 'text-[#000] border-[#000]'
                          } md:h-5 h-[18px] md:w-5 w-[18px] md:[&_svg]:h-[12px] [&_svg]:h-[10px] md:[&_svg]:w-[12px] [&_svg]:w-[10px]`}
                        />
                        <Label
                          htmlFor='express'
                          className={`font-semibold md:text-[20px] text-[16px] md:leading-[23px] leading-[30px] ${
                            selected === 'express'
                              ? 'text-[#28A745]'
                              : 'text-[#000000]'
                          }`}
                        >
                          Express Delivery
                        </Label>
                      </div>
                      <span
                        className={`font-medium md:text-[20px] text-[16px] leading-[30px] ${
                          selected === 'express'
                            ? 'text-[#28A745]'
                            : 'text-[#000000]'
                        }`}
                      >
                        £10.00
                      </span>
                    </div>
                    {selected === 'express' && (
                      <div className='mt-2 text-[#6B6B6B]'>
                        <p className='md:text-[18px] text-[12px] md:leading-[25px] leading-[15px]'>
                          Express delivery are sent to you email within 1 UK
                          business hour.
                        </p>
                        <Input
                          type='email'
                          placeholder='Enter Your Email Address'
                          className='w-full border bg-white mt-2 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-0'
                        />
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            <Elements
              stripe={stripePromise}
              options={{
                appearance: {
                  theme: 'stripe',
                },
                amount: convertToSubCurrency(totalAmount ? totalAmount : 1), //cents
                currency: 'usd',
                mode: 'payment',
              }}
            >
              <CheckOutPage amount={totalAmount ? totalAmount : 1} />
            </Elements>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSection
