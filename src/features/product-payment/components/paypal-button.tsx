/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
} from '@paypal/react-paypal-js'
import { useFormContext } from 'react-hook-form'

interface PaypalButtonProps {
  amount: string
  onSuccess?: (details: unknown) => void
}

const PaypalButton = ({ amount,onSuccess }: PaypalButtonProps) => {
  const { formState: { isValid } } = useFormContext()
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'USD',
      }}
    >
      <PayPalButtons
      style={{
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal",
        height: 40,
      }}
        fundingSource={FUNDING.PAYPAL}
        createOrder={(data, action) => {
          return action.order.create({
            intent:'CAPTURE',
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: 'USD',
                },
              },
            ],
          })
        }}
        onApprove={(data, actions) => {
          if (!actions.order) {
            console.error('Order actions are undefined')
            return Promise.resolve() // Ensure a Promise<void> is always returned
          }

          return actions.order
            .capture()
            .then((details) => {
              console.log('🚀 ~ Order captured successfully:', details)
              onSuccess && onSuccess(details)
              
            })
            .catch((error) => {
              console.error('🚀 ~ Error capturing order:', error)
            })
        }}
        disabled={!isValid || !amount}
      />
    </PayPalScriptProvider>
  )
}

export default PaypalButton
