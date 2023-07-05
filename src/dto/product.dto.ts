import { z } from 'zod'

export const ProductSchema = z
  .object({
    id: z.string({ required_error: 'id is required' }),
    name: z.string({ required_error: 'name is required' }).trim(),
    price: z.number({ required_error: 'price is required' }),
    description: z.string({ required_error: 'description is required' }),
  })
  .strict()
export const ProductDtoSchema = ProductSchema.omit({ id: true })
export type ProductDto = z.infer<typeof ProductSchema>
export type Product = z.infer<typeof ProductSchema>
