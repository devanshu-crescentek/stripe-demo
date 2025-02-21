'use client'
import { useState } from 'react'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Check } from 'lucide-react'
import convertToSubCurrency from '@/lib/convertToSubCurrency'
import CheckOutPage from './CheckOutPage'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const documents = [
  {
    id: 'title-register',
    name: 'Title Register',
    price: 19.95,
    required: true,
  },
  { id: 'title-plan', name: 'Title Plan', price: 19.95, required: false },
  {
    id: 'conveyancing-pack',
    name: 'Conveyancing Pack',
    price: 49.95,
    required: false,
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
          <div className='grid lg:grid-cols-2  md:gap-10 gap-3  md:px-10 px-5'>
            <div className=''>
              {/* Header */}
              <div className='flex items-start space-x-2'>
                <span className='text-2xl'>👇</span>
                <h2 className='text-2xl font-semibold'>
                  We&apos;ve found the following documents for the address
                </h2>
              </div>

              {/* Address */}
              <p className='text-gray-600 text-sm mt-2'>
                24 Boughton Rd, Wick Hill’ CA, RG40 9BL
                <br />
                <span className='font-medium'>Title Number: 13456</span>
              </p>

              <hr className='my-4 border-gray-300' />

              {/* Document Selection */}
              <h3 className='font-semibold'>Select Your Documents</h3>

              <div className='mt-3 space-y-3'>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-md flex items-start space-x-3 cursor-pointer`}
                    onClick={() => !doc.required && toggleSelection(doc.id)}
                  >
                    <div className='w-5 h-5 flex items-center justify-center border rounded-md bg-white'>
                      {selectedDocs.includes(doc.id) && (
                        <Check size={16} className='text-green-500' />
                      )}
                    </div>
                    <div>
                      <p className='font-semibold'>
                        {doc.name} - £{doc.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className='my-4 border-gray-300' />

              {/* Fast Track Toggle */}
              <div className='flex items-center justify-between'>
                <p className='font-semibold'>Fast Track (1 Hour) - £10.00</p>
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
