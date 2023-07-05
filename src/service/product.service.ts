import { Product, ProductDto } from 'dto'
import { db, runService } from 'utils'

export const insertProduct = async (data: ProductDto) => {
  return runService(async () => db.product.create({ data }), 'unable to add product')
}
export const updateProduct = (data: ProductDto, id: Product['id']) => {
  return runService(
    async () =>
      db.product.update({
        data,
        where: {
          id,
        },
      }),
    'unable to update product'
  )
}
export const deleteProduct = async (id: Product['id']) => {
  return runService(
    async () =>
      db.product.update({
        data: {
          status: 'DISABLED',
        },
        where: {
          id,
        },
      }),
    'unable to delete product'
  )
}
export const getProductById = async (id: Product['id']) => {
  return runService(async () =>
    db.product.findUnique({
      where: {
        id,
      },
    })
  )
}
export const getProducts = (condition: object, orderBy: object, page: number, pageSize: number) => {
  const take = page ? undefined : pageSize || 10
  const skip = take ? (page - 1) * take : 0
  return runService(() =>
    db.product.findMany({
      where: condition || {},
      orderBy,
      take,
      skip,
    })
  )
}
