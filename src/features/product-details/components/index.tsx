'use client'
import AddressInfo from '@/features/product-details/components/address-info'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form } from '@/components/ui/form'

import TenureInfo from '@/features/product-details/components/tenure-info'

const schema = z.object({
  address: z.string().nonempty('Address is required'),
  city: z.string().nonempty('City is required'),
  country: z.string().nonempty('State is required'),
  postalCode: z.string().nonempty('Postal Code is required'),
  tenure: z.enum(['freehold', 'leasehold', 'not-sure'], {
    required_error: 'Please select an option.',
  }),
  title_number: z
    .union([
      z.number(),
      z
        .string()
        .length(0)
        .transform(() => undefined),
    ])
    .optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Privacy Policy.',
  }),
})

const ProductDetails = () => {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: '',
      city: '',
      country: '',
      postalCode: '',
      tenure: 'freehold',
      agreeTerms: false,
    },
  })

  return (
    <Form {...methods}>
      <FormProvider {...methods}>
        <form>
          <div className='h-full mb-10'>
            <div className='container w-full mx-auto grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-6 lg:gap-12'>
              <div>
                <AddressInfo />
              </div>

              <div>
                <TenureInfo />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Form>
  )
}

export default ProductDetails
