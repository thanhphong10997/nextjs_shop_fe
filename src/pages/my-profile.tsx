// Next
import { NextPage } from 'next'

// React
import { ReactNode } from 'react'

// views
import { LayoutNotApp } from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/layouts/pages/my-profile'

type TProps = {}

export const Profile: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default Profile

Profile.getLayout = (page: ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
