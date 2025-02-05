// Next
import { NextPage } from 'next'
import ReviewListPage from 'src/views/layouts/pages/manage-order/reviews/ReviewList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <ReviewListPage />
}

export default Index
