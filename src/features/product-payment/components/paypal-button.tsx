import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
} from '@paypal/react-paypal-js'
import posthog from 'posthog-js'
import { useFormContext } from 'react-hook-form'

interface PaypalButtonProps {
  amount: string
  onSuccess?: (details: unknown) => void
}

const PaypalButton = ({ amount, onSuccess }: PaypalButtonProps) => {
  const { handleSubmit } = useFormContext()

  // Function to validate form before creating order
  const validateAndCreateOrder = async () => {
    return new Promise<string>((resolve, reject) => {
      handleSubmit(
        async () => {
          // If form validation succeeds, create the order
          resolve(
            JSON.stringify({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: 'USD',
                  },
                },
              ],
            })
          )
        },
        () => {
          reject(console.log('Form validation failed'))
        }
      )()
    })
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: 'USD',
      }}
    >
      <PayPalButtons
        className='w-full h-[40px]'
        style={{
          shape: 'rect',
          layout: 'vertical',
          color: 'gold',
          label: 'paypal',
          height: 40,
        }}
        fundingSource={FUNDING.PAYPAL}
        createOrder={async (_, actions) => {
          try {
            const orderData = await validateAndCreateOrder()
            posthog.capture('Pay by paypal', {
              amount,
            })
            return actions.order.create(JSON.parse(orderData))
          } catch (error) {
            console.log('🚀 ~ Error creating order:', error)
            return Promise.reject(error)
          }
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) {
            console.error('Order actions are undefined')
            return Promise.resolve()
          }

          return actions.order
            .capture()
            .then((details) => {
              console.log('🚀 ~ Order captured successfully:', details)
              if (onSuccess) {
                onSuccess(details)
              }
            })
            .catch((error) => {
              console.log('🚀 ~ Error capturing order:', error)
            })
        }}
      />
    </PayPalScriptProvider>
  )
}

export default PaypalButton
