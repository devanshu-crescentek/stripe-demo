"use client"

import { redirect, useSearchParams } from "next/navigation"
import Image from "next/image"

import { Info } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAppSelector } from "@/store/hook"
import { getEstimatedTime, getNextBusinessDayTime } from "@/lib/utils"

const PaymentSuccess = () => {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount")

  const {
    selectedAddress,
    tenure_info,
    selectedDocuments,
    orderID,
    payment,
    paymentTime,
    email
  } = useAppSelector((state) => state.address) || {}

  if (
    !selectedAddress ||
    !tenure_info ||
    !selectedDocuments ||
    selectedDocuments.length === 0 ||
    !orderID
  ) {
    redirect("/")
  }

  const fastTrack = selectedDocuments.find(
    (document) => document.name === "Fast Track"
  )

  return (
    <div className="flex-1 mb-10">
      <div className="flex flex-row sm:justify-center justify-between items-center sm:mb-10 mb-6">
        <div className="w-[149px] h-[115px] sm:ml-0 -ml-4">
          <Image
            src="/success.gif"
            alt="Success Animation"
            width={100}
            height={100}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col pr-4">
          <h2 className="font-semibold sm:text-start text-end sm:text-[40px] text-[26px] leading-[30px] mb-2">
            Order Successful!
          </h2>
          <p className="font-medium sm:text-start text-end text-[20px] leading-[30px] capitalize">
            Order ID: <span className="text-[#28A745]">{orderID}</span>
          </p>
        </div>
      </div>
      <div className='container w-full mx-auto px-4 sm:px-6 lg:gap-12 mb-[30px]'>
        <div className='w-full md:grid lg:grid-cols-2 flex flex-col-reverse sm:gap-6 gap-4'>
          <Card>
            <CardHeader className="sm:py-6 py-4">
              <h3 className="sm:text-[40px] text-[18px] leading-[30px] font-semibold">
                Property Details
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4 mb-4">
                <p className="text-[##0B0C0C] sm:text-[20px] text-[16px] md:leading-[30px] leading-[25px] font-normal w-full">
                  {selectedAddress?.address && `${selectedAddress?.address}, `}
                  {selectedAddress?.city && `${selectedAddress?.city}, `}
                  {selectedAddress?.country && `${selectedAddress?.country}`}
                  <br />
                  {selectedAddress?.postalCode && selectedAddress?.postalCode}
                  <br />
                  {tenure_info?.titleNumber && (
                    <>Title Number: {tenure_info.titleNumber}</>
                  )}
                </p>
              </div>
              <div className="border-t border-[#000000] opacity-10 my-4 w-full"></div>
              <div className="">
                {selectedDocuments
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a, b) => a.price - b.price) // Sort by price in ascending orderF
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border sm:pb-4 pb-3 gap-4"
                    >
                      <div className="leading-none cursor-pointer flex items-start gap-2 w-full">
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold text-[18px] text-black w-fit leading-[25px] flex items-start">
                          <div
                            className={`mr-2 w-full ${
                              item.name === "Fast Track" ? "min-w-[148px]" : ""
                            } sm:max-w-full max-w-[135px]`}
                          >
                            {item.name === "Fast Track"
                              ? "Express Delivery"
                              : item.name}
                          </div>{" "}
                          <div
                            className="relative group mt-1"
                            onClick={(e) => {
                              e.preventDefault()
                            }}
                          >
                            <Info className="w-5 h-5 text-[#868686] cursor-pointer" />
                            <div className="z-10 absolute left-1/2 transform -translate-x-1/2 top-5 hidden group-hover:flex w-[250px] bg-white border border-[#868686] text-sm px-3 py-2 rounded-md shadow-md break-words font-normal">
                              {item.description || "No description available"}
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold text-[20px] text-black">
                          £{item.price.toFixed(2)}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="border-t border-[#000000] opacity-10 my-4 w-full"></div>
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col w-full items-start mb-4 gap-2">
                  <h4 className="font-normal sm:text-[20px] text-[18px] leading-[30px] text-[#868686] ">
                    Payment Method
                  </h4>
                  <div className="h-[22px] flex items-center justify-center">
                    <Image
                      width={30}
                      height={12}
                      src={
                        payment === "card"
                          ? "/icons/Visa.svg"
                          : "/icons/paypal.svg"
                      }
                      alt="visa"
                      className={`w-[56px] h-auto`}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full items-end mb-4">
                  <h2 className="font-normal sm:text-[20px] text-[18px] leading-[30px] text-[#868686]">
                    Order Total
                  </h2>
                  <h2 className="font-semibold sm:text-[30px] text-[22px] leading-[30px]">
                    £{amount}
                  </h2>
                </div>
              </div>
              <div className='border-t border-[#000000] opacity-10 my-4 w-full'></div>
              <div className='flex items-center justify-center'>
                <button
                  type='button'
                  className={`w-full bg-[#28A745] sm:text-[18px] text-[16px] h-[58px] text-white font-semibold sm:p-3 p-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700 capitalize`}
                  onClick={() => redirect('/')}
                >
                    Order Title for <br className="sm:hidden block"/> New Address <span>&#8594;</span>
                </button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start   gap-2">
                <div className="sm:w-[43px] w-[27px] sm:h-[43px] h-[27px]">
                  <Image
                    src="/mail.svg"
                    alt="mail"
                    width={30}
                    height={30}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <h4 className="font-medium sm:text-[26px] text-[18px] sm:leading-[30px] leading-[23px] mb-1 capitalize">
                    Your documents will be delivered via email
                  </h4>
                  <a
                    href={`mailto:${email}`}
                    target="_blank"
                    className="text-[#28A745] font-medium sm:text-[20px] text-[14px] leading-[20px] mb-2"
                  >
                    {email}
                  </a>
                  <p className="text-[#868686] font-medium sm:text-[20px] text-[14px] leading-[20px]">
                    (If not in inbox,{" "}
                    <span className="text-[#28A745]">check junk/spam</span>)
                  </p>
                </div>
              </div>
              <div className="border-t border-[#000000] opacity-10 my-4 w-full"></div>
              <div className="flex flex-col gap-4 justify-start items-start">
                <div className="flex items-start gap-2">
                  <div className="w-[43px] h-[43px]">
                    <Image
                      src={
                        fastTrack
                          ? "/fast_track_delivery.svg"
                          : "/standard_delivery.svg"
                      }
                      alt={fastTrack ? "fast track" : "standard"}
                      width={100}
                      height={100}
                      className="w-full h-full"
                    />
                  </div>
                  <div className='flex flex-col'>
                    <h4 className='font-medium sm:text-[26px] text-[18px] sm:leading-[30px] leading-[20px] mb-2 capitalize'>
                      Your {fastTrack ? 'Fast track' : 'Standard'} Delivery is
                      on its way! should arrive by
                    </h4>
                    <p className="text-[#28A745] text-[18px] font-medium leading-[20px] ">
                      {fastTrack ? (
                        <>
                          {getEstimatedTime(
                            "Europe/London",
                            new Date(paymentTime as string)
                          )}
                        </>
                      ) : (
                        <>
                          {getNextBusinessDayTime(
                            "Europe/London",
                            new Date(paymentTime as string)
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
