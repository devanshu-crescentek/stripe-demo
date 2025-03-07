/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import { JSX, useCallback, useEffect, useState } from "react"

import {
  ExpressCheckoutElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { useFormContext } from "react-hook-form"

import { Card, CardContent } from "@/components/ui/card"
import PaymentDrawer from "@/features/product-payment/components/payment-drawer"
import PaypalButton from "@/features/product-payment/components/paypal-button"

import useDeviceType from "@/hooks/use-device-type"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { paymentMethods } from "@/lib/constants"
import convertToSubCurrency from "@/lib/convertToSubCurrency"

import { useUpdateCartMutation } from "@/store/api/add-to-cart"
import {
  setEmail,
  setOrderID,
  setPayment,
  setPaymentTime,
  setSelectedDocuments
} from "@/store/slices/address-slice"
import { getLondonISOString, validEmailRegex } from "@/lib/utils"

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { handleSubmit, watch } = useFormContext()

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState("")
  const [paymentRequestAvailable, setPaymentRequestAvailable] = useState(false)
  const [isExpressElement, setIsExpressElement] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [updateCart, { isLoading: updateCartLoading }] = useUpdateCartMutation()

  const deviceType = useDeviceType()
  const userEmail = watch("userEmail")
  const selectedDocs = watch("selectedDocs")

  const { selectedAddress, tenure_info, documents, orderID } = useAppSelector(
    (state) => state.address
  )

  useEffect(() => {
    if (!stripe || !amount) return
    setPaymentRequestAvailable(true)
  }, [stripe, amount])

  const addToCartHandler = useCallback(async () => {
    if (!amount) return

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: convertToSubCurrency(amount),
        ...(orderID && { order_id: orderID })
      })
    })
      .then(async (res) => {
        const { clientSecret } = await res.json()
        setClientSecret(clientSecret)
      })
      .catch(() => {
        setClientSecret("")
      })

    try {
      const selectedPayloadDoc = selectedDocs.map((doc: number) => ({
        product_id: String(doc)
      }))
      const fastTrackId =
        watch("delivery") === "express"
          ? documents.find((doc) => doc.name === "Fast Track")?.id
          : null
      if (fastTrackId)
        selectedPayloadDoc.push({ product_id: String(fastTrackId) })

      const cartPayload = {
        title_number: String(tenure_info.titleNumber || ""),
        address_one: selectedAddress?.address || "",
        city: selectedAddress?.city || "",
        county: selectedAddress?.county || "",
        post_code: selectedAddress?.postalCode || "",
        tenure: tenure_info.tenure,
        customer_email: watch("userEmail").match(validEmailRegex)
          ? watch("userEmail")
          : "",
        payment_status: "pending",
        order_status: "pending",
        product_data: selectedPayloadDoc,
        country: documents[0]?.country || "",
        order_id: orderID
      }

      if (orderID) {
        const res = await updateCart(cartPayload).unwrap()
        dispatch(setOrderID(res.order_id))
        console.log("update")
      }
    } catch (error) {
      console.error("🚀 ~ addToCartHandler ~ error:", error)
      // dispatch(setOrderID(null))
      // setClientSecret('')
    }
  }, [amount, orderID])

  useEffect(() => {
    addToCartHandler()
  }, [amount])

  useEffect(() => {
    const handler = setTimeout(() => {
      if (userEmail.match(validEmailRegex)) {
        addToCartHandler()
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [userEmail])

  useEffect(() => {
    if (updateCartLoading) {
      setIsProcessing(true)
      setErrorMessage("Please wait a few seconds...")
    } else {
      setIsProcessing(false)
      setErrorMessage("")
    }
  }, [updateCartLoading])

  const onClick = ({ resolve: resolve }: any) => {
    const options = {
      emailRequired: true
    }
    resolve(options)
  }

  const onSubmit = async (
    isPayByCard: boolean
  ): Promise<JSX.Element | undefined> => {
    try {
      setIsProcessing(true)

      if (!stripe || !elements) {
        return
      }

      const { error: submitError } = await elements.submit()

      if (submitError) {
        setErrorMessage(submitError.message!)
        setIsProcessing(false)
        return
      }

      const sDocuments = documents
        .filter((doc) => selectedDocs.includes(doc.id))
        .map((doc) => {
          return {
            id: doc.id,
            name: doc.name,
            price: doc.price,
            description: doc.description
          }
        })

      if (watch("delivery") === "express") {
        const fastTrack = documents.find((doc) => doc.name === "Fast Track")
        if (fastTrack) {
          sDocuments.push({
            id: fastTrack.id,
            name: "Fast Track",
            price: fastTrack.price,
            description:
              "Your documents will be delivered via email within  1 business hour."
          })
        }
      }
      dispatch(setPayment("card"))
      dispatch(setPaymentTime(getLondonISOString()))
      dispatch(setSelectedDocuments(sDocuments))
      dispatch(setEmail(watch("userEmail")))

      posthog.identify(userEmail)
      if (isPayByCard) {
        posthog.capture("Pay by card")
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?amount=${amount}&order_id=${orderID}`
        }
      })

      if (error) {
        setErrorMessage(error.message!)
      }
      setIsProcessing(false)
    } catch (error) {
      console.log("🚀 ~ CheckoutPage ~ error:", error)
      setIsProcessing(false)
      setErrorMessage("Something went wrong. Please try again later.")
    }
  }

  const handlePaypalSuccess = (details: any) => {
    if (details.status === "COMPLETED") {
      router.push(`/payment-success?amount=${amount}&order_id=${orderID}`)
    }
  }

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <>
      {deviceType === "desktop" && (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <h2 className="md:text-[20px] text-[15px] font-semibold whitespace-nowrap">
                  Secure Payment
                </h2>

                <div className="flex flex-wrap items-center justify-start gap-1">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className="h-[22px] flex items-center justify-center"
                    >
                      <Image
                        width={30}
                        height={12}
                        src={method.src}
                        alt={method.alt}
                        className={`w-[42px] h-auto`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#000000] opacity-10 my-4"></div>
              {/* Show Google Pay / Apple Pay Button if available */}
              {paymentRequestAvailable && deviceType == "desktop" && (
                <div className="mb-4 justify-center gap-2 hidden md:flex w-full">
                  <ExpressCheckoutElement
                    onClick={(resolve) =>
                      handleSubmit(() => onClick(resolve))()
                    }
                    onConfirm={() => onSubmit(false)}
                    options={{
                      buttonHeight: 40,
                      paymentMethodOrder: ["google_pay", "apple_pay", "card"],
                      buttonType: {
                        googlePay: "checkout",
                        applePay: "check-out"
                      }
                    }}
                    onReady={(event) => {
                      if (event.availablePaymentMethods) {
                        setIsExpressElement(true)
                      } else {
                        setIsExpressElement(false)
                      }
                    }}
                    className={`w-full gap-4 h-[40px] mb-0 ${
                      isExpressElement ? "block" : "hidden"
                    }`}
                  />
                  <PaypalButton
                    amount={amount.toString()}
                    onSuccess={handlePaypalSuccess}
                  />
                </div>
              )}
              <div className="hidden md:flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Total</p>
                  <p className="text-[40px] leading-[22px] font-semibold">
                    £{amount ? amount : 0}
                  </p>
                </div>

                {/* Pay Button */}
                <PaymentDrawer
                  errorMessage={errorMessage}
                  handleSubmit={handleSubmit}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  isProcessing={isProcessing}
                  stripe={stripe}
                  onSubmit={onSubmit}
                  setErrorMessage={setErrorMessage}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {deviceType === "mobile" && (
        <div className="flex items-center justify-between gap-6 mb-[220px]">
          <h2 className="md:text-[20px] text-[15px] font-semibold whitespace-nowrap">
            Secure Payment
          </h2>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-start gap-1">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="h-[22px] flex items-center justify-center"
              >
                <Image
                  width={30}
                  height={12}
                  src={method.src}
                  alt={method.alt}
                  className={`w-[42px] h-auto`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {paymentRequestAvailable && deviceType === "mobile" && (
        <div className="fixed block md:hidden bottom-0 left-0 w-full border shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.12)] rounded-t-xl p-4 bg-white">
          {/* Payment Methods */}
          <div className="flex justify-between items-center gap-4 mb-3 w-full">
            <ExpressCheckoutElement
              onClick={(resolve) => handleSubmit(() => onClick(resolve))()}
              onConfirm={() => onSubmit(false)}
              options={{
                buttonHeight: 40,
                paymentMethodOrder: ["google_pay", "apple_pay", "card"],
                buttonType: {
                  googlePay: "checkout",
                  applePay: "check-out"
                }
              }}
              onReady={(event) => {
                if (event.availablePaymentMethods) {
                  setIsExpressElement(true)
                } else {
                  setIsExpressElement(false)
                }
              }}
              className={`w-full gap-4 h-[40px] mb-0 ${
                isExpressElement ? "block" : "hidden"
              }`}
            />
            <PaypalButton
              amount={amount.toString()}
              onSuccess={handlePaypalSuccess}
            />
          </div>
          {/* Total & Pay Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-2xl font-bold">£{amount ? amount : 0}</p>
            </div>

            <PaymentDrawer
              errorMessage={errorMessage}
              handleSubmit={handleSubmit}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isProcessing={isProcessing}
              stripe={stripe}
              onSubmit={onSubmit}
              setErrorMessage={setErrorMessage}
              setIsProcessing={setIsProcessing}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutPage
