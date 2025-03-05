import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setPayment, setSelectedDocuments } from '@/store/slices/address-slice'
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
  const dispatch = useAppDispatch()
  const { handleSubmit, watch } = useFormContext()

  const { orderID, documents } = useAppSelector((state) => state.address)

  const selectedDocs = watch('selectedDocs')

  // Function to validate form before creating order
  const validateAndCreateOrder = async () => {
    const sDocuments = documents
      .filter((doc) => selectedDocs.includes(doc.id))
      .map((doc) => {
        return {
          id: doc.id,
          name: doc.name,
          price: doc.price,
        }
      })

    if (watch('delivery') === 'express') {
      const fastTrack = documents.find((doc) => doc.name === 'Fast Track')
      if (fastTrack) {
        sDocuments.push({
          id: fastTrack.id,
          name: 'Fast Track',
          price: fastTrack.price,
        })
      }
    }

    dispatch(setSelectedDocuments(sDocuments))
    return new Promise<string>((resolve, reject) => {
      handleSubmit(
        async () => {
          // If form validation succeeds, create the order
          resolve(
            JSON.stringify({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  reference_id: orderID,
                  amount: {
                    value: amount,
                    currency_code: 'GBP',
                    breakdown: {
                      item_total: {
                        currency_code: 'GBP',
                        value: amount,
                      },
                    },
                  },
                  description:'app',
                  payment_origin: 'app',
                },
              ],
              application_context: {
                user_action: 'PAY_NOW',
                brand_name: 'Land Registry',
                payment_origin: 'app',
                payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                payment_method_selected: 'PAYPAL',
              },
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
        currency: 'GBP',
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
            dispatch(setPayment('paypal'))
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
            return Promise.resolve()
          }

          return actions.order
            .capture()
            .then((details) => {
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
