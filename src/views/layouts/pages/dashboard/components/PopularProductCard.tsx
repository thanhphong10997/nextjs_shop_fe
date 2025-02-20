import { Box, MenuItem, Typography, useTheme } from '@mui/material'
import React from 'react'
import { TPopularProduct } from '..'
import Image from 'next/image'
import { formatNumberToLocal } from 'src/utils'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'

type TProps = {
  data: TPopularProduct[]
}

const PopularProductCard = (props: TProps) => {
  // hooks
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()

  // props
  const { data } = props

  // handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px 0',
        height: '100%',
        maxHeight: '100%',
        borderRadius: '15px'
      }}
    >
      <Box sx={{ padding: '0 20px' }}>
        <Typography sx={{ fontWeight: '600', fontSize: '20px', mb: 2 }}>{t('popular_products')}</Typography>
      </Box>
      {data?.map((product: TPopularProduct) => {
        return (
          <MenuItem key={product?._id} sx={{ gap: 4 }} onClick={() => handleNavigateDetails(product?.slug)}>
            <Image height={60} width={60} src={product?.image} alt='product-image' />
            <Box sx={{ width: '60%' }}>
              <Typography
                sx={{
                  width: '100%',
                  color: theme.palette.primary.main,
                  fontWeight: '600',
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {product?.name}
              </Typography>
              <Typography color='secondary'>{product?.type?.name}</Typography>
            </Box>
            <Typography>{formatNumberToLocal(product?.price)}</Typography>
          </MenuItem>
        )
      })}
    </Box>
  )
}

export default PopularProductCard
