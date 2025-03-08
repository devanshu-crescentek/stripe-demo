'use client'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setSelectedAddress } from '@/store/slices/address-slice'
import { ChevronsRight } from 'lucide-react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

interface AddressItem {
  address?: string[]
  city?: string
  county?: string
  postcode?: string
}

const AddressList = () => {
  const dispatch = useAppDispatch()
  const data =
    (useAppSelector((state) => state.address.data) as AddressItem[]) || []
  const searchParams = useSearchParams()
  const router = useRouter()
  const postalCode = searchParams.get('postalCode')

  if (data?.length == 0 || !postalCode) return redirect('/')

  const handlerNavigate = (item: AddressItem | boolean) => {
    if (typeof item !== 'boolean') {
      const payload = {
        address: item.address ? item.address[0] : '',
        city: item.city,
        county: item.county,
        postalCode: item.postcode,
      }
      dispatch(setSelectedAddress(payload))
    } else {
      posthog.capture('Skipped address')
      dispatch(setSelectedAddress(null))
    }
    router.push('/details')
  }

  return (
    <div className='flex-1'>
      <div className='container mx-auto  w-full px-4 sm:px-6 lg:gap-12'>
        <h3 className='text-[1.5em] font-bold mb-[20px]'>
          Search Result For : {postalCode}
        </h3>
        <h5 className='text-[1.1875rem] font-normal leading-[1.3157894737] mb-[20px]'>
          {data.length} records found
        </h5>
        <ul>
          {data.map((item, index) => {
            return (
              <li
                key={index}
                className='pt-[5px] pb-[15px]'
                onClick={() => handlerNavigate(item)}
              >
                <span className='text-[#1d70b8] text-[18px] border-b border-[#1d70b8] cursor-pointer transition-all duration-200 hover:border-b-2 hover:text-[#155a8a]'>
                  {item?.address ? `${item?.address[0]}, ` : ''}{' '}
                  {item?.city ? `${item.city}, ` : ''}{' '}
                  {item?.county ? `${item.county}, ` : ''}{' '}
                  {item?.postcode ? `${item.postcode}` : ''}
                </span>
              </li>
            )
          })}
        </ul>
        <div>
          <button
            onClick={() => handlerNavigate(false)}
            className='bg-[#0B0C0C] max-w-[293px] max-h-[56px] w-full h-full text-white text-[13px] font-medium p-[20px] rounded-sm my-[20px] flex justify-center items-center gap-[10px]'
          >
            <span>Address not listed? Enter manually</span>
            <ChevronsRight className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddressList
