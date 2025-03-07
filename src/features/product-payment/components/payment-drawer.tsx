import React, { JSX } from 'react'

import { Stripe } from '@stripe/stripe-js'
import posthog from 'posthog-js'
import {
  FieldValues,
  useFormContext,
  UseFormHandleSubmit,
} from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { PaymentElement } from '@stripe/react-stripe-js'

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
        className='bg-[#28A745] hover:bg-green-700 text-white justify-center font-medium py-3 px-6 rounded-[4px] flex items-center space-x-2 w-[189px] h-[40px]'
        onClick={handleSubmit(() => {
          posthog.capture('Initiated pay by card')
          setIsOpen(true)
        })}
        type='button'
      >
        <span>Pay By Card</span>
        <span>→</span>
      </button>
      <DrawerContent className='z-[100]'>
        <DrawerHeader>
          <DrawerTitle>Card</DrawerTitle>
          <DrawerDescription>
            <PaymentElement
              options={{
                layout: 'accordion',
                defaultValues: {
                  billingDetails: {
                    email: watch('userEmail'),
                  },
                },
              }}
            />
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
            className={`w-full bg-[#28A745] text-[18px] h-[42px] text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 ${
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
                Pay
                <span>&#8594;</span>
              </>
            )}
          </button>
          <Button
            variant='outline'
            className='sm:w-[246px] w-full h-[40px]'
            onClick={() => {
              setErrorMessage('')
              setIsOpen(false)
              posthog.capture('Cancelled pay by card')
              setIsProcessing(false)
            }}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PaymentDrawer
