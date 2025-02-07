// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

// views
import PaymentVNPay from 'src/views/layouts/pages/payment/vnpay'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <PaymentVNPay />
}

export default Index

Index.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
