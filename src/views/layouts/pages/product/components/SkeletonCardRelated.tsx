// Mui
import { Box, Card, CardProps, Skeleton, styled } from '@mui/material'

// React
import React from 'react'

const StyledCard = styled(Card)<CardProps>(({ theme }) => {
  return {
    position: 'relative',
    boxShadow: theme.shadows[4],
    '.MuiCardMedia-root.MuiCardMedia-media': {
      objectFit: 'contain'
    }
  }
})

const SkeletonCardRelated = () => {
  return (
    <StyledCard sx={{ width: '100%' }}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant='rounded' width='100%' height={210} sx={{ fontSize: '1rem' }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Box sx={{ padding: '8px 12px' }}>
        <Skeleton variant='text' width='100%' height={60} />
        <Skeleton variant='text' width='50%' height={40} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton variant='text' width='30%' height={40} />
          <Skeleton variant='text' width='40px' height={40} />
        </Box>
      </Box>
    </StyledCard>
  )
}

export default SkeletonCardRelated
