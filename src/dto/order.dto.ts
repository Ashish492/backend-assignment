import isUUID from 'validator/lib/isUUID'
import { z } from 'zod'

export const OrderSchema = z
  .object({
    id: z.string({ required_error: 'id is required' }).refine(isUUID, 'enter a valid id'),
    productId: z.string({ required_error: 'name is required' }).trim().refine(isUUID, 'enter a valid productId'),
    totalAmount: z.number({ required_error: 'price is required' }),
    userId: z.string({ required_error: 'description is required' }).refine(isUUID, 'enter a valid userId'),
    quantity: z.number({ required_error: 'quantity required' }).min(1, 'quantity must be  equal or greater than 1'),
  })
  .strict()
export const OrderDtoSchema = OrderSchema.omit({ id: true, userId: true })

export type Order = z.infer<typeof OrderSchema>
export type OrderDto = z.infer<typeof OrderDtoSchema> & Pick<Order, 'userId'>
