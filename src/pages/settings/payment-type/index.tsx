// Next
import { NextPage } from 'next'
import { PERMISSIONS } from 'src/configs/permission'
import PaymentTypeListPage from 'src/views/layouts/pages/settings/payment-type/PaymentTypeList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <PaymentTypeListPage />
}

// Index.permission = [PERMISSIONS.SETTING.PAYMENT_TYPE.VIEW]
export default Index
