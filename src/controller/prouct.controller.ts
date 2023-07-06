import { Product, ProductDto } from 'dto'
import { omit } from 'lodash'
import { deleteProduct, getProductById, getProducts, insertProduct } from 'service'
import { CustomRouteFunction } from 'types'
export const addProductHandler: CustomRouteFunction<ProductDto> = async (req, res) => {
  const product = await insertProduct(req.body)
  res.json(product)
}
export const deleteProductByIdHandler: CustomRouteFunction<unknown, Pick<Product, 'id'>> = async (req, res) => {
  const product = await deleteProduct(req.params.id)
  res.json(omit(product!, ['status']))
}
export const findProductByIdHandler: CustomRouteFunction<unknown, Pick<Product, 'id'>> = async (req, res) => {
  const product = await getProductById(req.params.id)
  res.json(omit(product!, ['status']))
}
export const getProductsHandler: CustomRouteFunction<unknown, {}, Record<string, any>> = async (req, res) => {
  const { _sortBy = '', _page, _pageSize, ...filter } = req.query
  // const condition = Object.entries(filter).reduce(([key, value]) => {
  //   if (key.includes('_')) {
  //     const keyArray = key.split('_')
  //   }
  // })
  const sortBy = _sortBy.split(',').reduce((acc: Record<string, any>, value: string) => {
    const valueArray = value.split(':')
    acc[valueArray[0]] = ['asc', 'desc'].includes(valueArray[1]) ? valueArray[1] : 'asc'
    return acc
  }, {})

  const product = await getProducts(filter || {}, sortBy, _page, _pageSize)
  res.json(omit(product!, ['status']))
}
