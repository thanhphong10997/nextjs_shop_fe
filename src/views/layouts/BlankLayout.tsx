// React
import * as React from 'react'

// Next
import { NextPage } from 'next'
import { Box, BoxProps, styled } from '@mui/material'

// Iconify
// import { Icon } from '@iconify/react'

type TProps = {
  children: React.ReactNode
}

const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => {
  return {
    height: '100vh'
  }
})
const BlankLayout: NextPage<TProps> = ({ children }) => {
  return (
    <BlankLayoutWrapper>
      <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>{children}</Box>
    </BlankLayoutWrapper>
  )
}

export default BlankLayout
