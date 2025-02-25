import React from 'react'
import { Button } from '@/components/ui/button'
import { Stripe } from '@stripe/stripe-js'
import { PaymentElement } from '@stripe/react-stripe-js'
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'

type PaymentDrawerProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: (data: FieldValues) => void
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
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <button
        className='bg-green-500 hover:bg-green-600 text-white justify-center font-medium py-3 px-6 rounded-[4px] flex items-center space-x-2 w-[189px] h-[40px]'
        onClick={handleSubmit(() => setIsOpen(true))}
        type='button'
      >
        <span>Pay By Card</span>
        <span>→</span>
      </button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Card</DrawerTitle>
          <DrawerDescription>
            <PaymentElement options={{ layout: 'accordion' }} />
            {errorMessage && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
                <span className='block sm:inline'>{errorMessage}</span>
              </div>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isProcessing || !stripe}
            type='button'
          >
            Pay
          </Button>
          <DrawerClose>
            <Button
              variant='outline'
              onClick={() => {
                setErrorMessage('')
                setIsProcessing(false)
              }}
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default PaymentDrawer
