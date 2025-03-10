import React, { JSX } from 'react'

import { PaymentElement } from '@stripe/react-stripe-js'
import { Stripe } from '@stripe/stripe-js'
import { XIcon } from 'lucide-react'
import posthog from 'posthog-js'
import {
  FieldValues,
  useFormContext,
  UseFormHandleSubmit,
} from 'react-hook-form'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

type PaymentDrawerProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (isPayByCard: boolean) => Promise<JSX.Element | undefined>
  handleSubmit: UseFormHandleSubmit<FieldValues>
  errorMessage: string
  isProcessing: boolean
  stripe: Stripe | null
  setErrorMessage: (message: string) => void
  setIsProcessing: (processing: boolean) => void
}

const PaymentDrawer: React.FC<PaymentDrawerProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  handleSubmit,
  errorMessage,
  isProcessing,
  stripe,
  setErrorMessage,
  setIsProcessing,
}) => {
  const { watch } = useFormContext()

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      onClose={() => {
        posthog.capture('Dismissed pay by card')
      }}
    >
      <button
        className='bg-[#28A745] hover:bg-green-700 text-white justify-center font-medium sm:py-3 py-3 sm:px-6 px-4 rounded-[4px] sm:text-[18px] text-[16px] flex items-center sm:space-x-2 space-x-0 md:w-[189px] w-full h-[47px]'
        onClick={handleSubmit(() => {
          posthog.capture('Initiated pay by card')
          setIsOpen(true)
        })}
        type='button'
      >
        <span>Pay By Card</span>
        <span className='!ml-1'>→</span>
      </button>
      <DrawerContent className='z-[100]'>
        <DrawerHeader>
          <DrawerTitle>
            <div className='flex items-center justify-between gap-4'>
              <h2 className='text-[18px] font-semibold'>Card</h2>
              <button
                className='text-black hover:text-gray-700'
                onClick={() => {
                  setErrorMessage('')
                  posthog.capture('Cancelled pay by card')
                  setIsProcessing(false)
                  setIsOpen(false)
                }}
              >
                <XIcon className='size-6' />
              </button>
            </div>
          </DrawerTitle>
          <DrawerDescription>
            <PaymentElement
              options={{
                layout: 'accordion',
                defaultValues: {
                  billingDetails: {
                    email: watch('userEmail'),
                  },
                },
                fields: {
                  billingDetails: {
                    address: 'never',
                  },
                },
              }}
              className='otp-input'
            />
            <div className='flex mt-2 items-end justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                x='0px'
                y='0px'
                width='24'
                height='24'
                fill='#28A745'
                viewBox='0 0 30 30'
              >
                <path d='M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z'></path>
              </svg>
              <span className='text-[12px] ml-1'>
                Secured with 256-bit encryption
              </span>
            </div>
            {errorMessage && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
                <span className='block sm:inline'>{errorMessage}</span>
              </div>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className='flex items-center justify-between'>
          <button
            type='button'
            className={`w-full bg-[#28A745] mb-5 text-[18px] h-[42px] text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 ${
              isProcessing || !stripe
                ? '!bg-black opacity-50 text-white cursor-not-allowed'
                : ''
            }`}
            onClick={handleSubmit(() => onSubmit(false))}
            disabled={isProcessing || !stripe}
          >
            {isProcessing ? (
              <>
                <span>Please wait...</span>
              </>
            ) : (
              <>
                Complete Order
                <span>&#8594;</span>
              </>
            )}
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PaymentDrawer
