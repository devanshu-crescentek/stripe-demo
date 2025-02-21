'use client'
import Image from 'next/image'
import { useState } from 'react'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Check, Edit, Info } from 'lucide-react'
import convertToSubCurrency from '@/lib/convertToSubCurrency'
import CheckOutPage from './CheckOutPage'
import { Button } from '../ui/button'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  const [isToggle, setIsToggle] = useState(false)

  const toggleSelection = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id)
        ? documents.find((doc) => doc.id === id)?.required
          ? prev // Keep required items selected
          : prev.filter((doc) => doc !== id)
        : [...prev, id]
    )
  }

  const totalAmount =
    documents
      .filter((doc) => selectedDocs.includes(doc.id))
      .reduce((sum, doc) => sum + doc.price, 0) + (isToggle ? 10.0 : 0)

  return (
    <div>
      <div className='w-full py-10 sm:py-20'>
        <div className='container max-w-6xl mx-auto'>
          <div className='grid lg:grid-cols-2 md:gap-10 gap-3 md:px-10 px-5'>
            <div className=''>
              <div className='flex items-center space-x-2 mb-4'>
                <Image src='/thumb.svg' alt='Check' width={30} height={30} />
                <h2 className='md:text-2xl text-[18px] font-semibold'>
                  We&apos;ve found the following documents for the address
                </h2>
              </div>

              {/* Address */}
              <div className='flex items-start justify-between mb-6'>
                <p className='text-[#0B0C0C] md:text-[20px] text-[18px] leading-[30px]'>
                  24 Boughton Rd,
                  <br className='md:hidden block' />
                  Wick Hill’ CA,
                  <br className='md:hidden block' />
                  RG40 9BL
                  <br />
                  Title Number: 13456
                </p>
                <Button className='bg-[#28A745] rounded-[4px] ' disabled>
                  <Edit /> Edit
                </Button>
              </div>

              <div className='border-t border-dashed border-[#000000] my-4'></div>

              {/* Document Selection */}
              <h3 className='font-semibold md:text-[30px] text-[18px] leading-[23px] mt-6'>
                Select Your Documents
              </h3>

              <div className='mt-3 space-y-3 hidden md:block'>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-md flex items-start space-x-3 cursor-pointer`}
                    onClick={() => !doc.required && toggleSelection(doc.id)}
                  >
                    <div
                      className={`min-w-[27px] w-[27px] min-h-[27px] h-[27px] flex items-center justify-center border rounded-md ${
                        selectedDocs.includes(doc.id)
                          ? 'bg-[#28A745] text-white'
                          : 'bg-white'
                      }`}
                    >
                      {selectedDocs.includes(doc.id) && (
                        <Check size={20} className='text-white' />
                      )}
                    </div>
                    <div>
                      <p className='font-semibold'>
                        {doc.name} - £{doc.price.toFixed(2)}
                      </p>
                      <p className='text-sm text-gray-600'>{doc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt space-y-3 block md:hidden'>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`py-3 rounded-md flex items-start space-x-3 cursor-pointer`}
                    onClick={() => !doc.required && toggleSelection(doc.id)}
                  >
                    <div className='flex flex-col items-start justify-between w-full'>
                      <p className='font-semibold text-[18px] mb-2'>
                        {doc.name}
                      </p>
                      <p className='text-sm text-gray-600'>{doc.description}</p>
                    </div>
                    <p className='font-semibold text-[20px]'>
                      £{doc.price.toFixed(2)}
                    </p>
                    <div
                      className={`min-w-[20px] w-[20px] min-h-[20px] h-[20px] flex items-center justify-center border rounded-md mt-1 ${
                        selectedDocs.includes(doc.id)
                          ? 'bg-[#28A745] text-white'
                          : 'bg-white'
                      }`}
                    >
                      {selectedDocs.includes(doc.id) && (
                        <Check size={16} className='text-white' />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t border-dashed border-[#000000] my-4'></div>

              {/* Fast Track Toggle */}
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
                  <p className='font-semibold flex items-center gap-1 text-[18px] leading-[30px] md:hidden'> £10.00</p>
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
              </div>
            </div>
            <div className=''>
              <Elements
                stripe={stripePromise}
                options={{
                  appearance: {
                    theme: 'stripe',
                  },
                  amount: convertToSubCurrency(totalAmount), //cents
                  currency: 'usd',
                  mode: 'payment',
                }}
              >
                <CheckOutPage amount={totalAmount} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSection
