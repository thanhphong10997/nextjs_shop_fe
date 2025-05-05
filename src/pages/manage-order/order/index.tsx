// Next
import Spinner from '@/components/spinner'
import { NextPage } from 'next'
import { Suspense } from 'react'

// others
import { PERMISSIONS } from 'src/configs/permission'
import OrderProductListPage from 'src/views/layouts/pages/manage-order/order-product/OrderProductList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <OrderProductListPage />
    </Suspense>
  )
}
Index.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Index
