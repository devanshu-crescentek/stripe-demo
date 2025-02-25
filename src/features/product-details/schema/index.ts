import { z } from 'zod'

export const productDetailsSchema = z.object({
  address: z.string().nonempty('Address is required'),
  city: z.string().nonempty('City is required'),
  country: z.string().nonempty('State is required'),
  postalCode: z.string().nonempty('Postal Code is required'),
  tenure: z.enum(['freehold', 'leasehold', 'not-sure'], {
    required_error: 'Please select an option.',
  }),
  title_number:z.coerce.number().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Privacy Policy.',
  }),
})
