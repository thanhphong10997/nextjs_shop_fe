// Next
import { NextPage } from 'next'
import CommentListPage from 'src/views/layouts/pages/manage-product/comment/CommentList'

type TProps = {}

export const Index: NextPage<TProps> = () => {
  return <CommentListPage />
}

export default Index
