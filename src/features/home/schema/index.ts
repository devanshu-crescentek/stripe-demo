import { z } from 'zod'

export const postalCodeSchema = z.object({
  postalCode: z
    .string()
    .min(1, {
      message: 'Postal Code is required.',
    })
    .max(10, {
      message: 'Postal Code must be less than 10 characters.',
    }),
})
