// React
import * as React from 'react'

// Mui
import { styled, useTheme } from '@mui/material/styles'
import Card, { CardProps } from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Box, Rating } from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'

// Icon
import { Icon } from '@iconify/react/dist/iconify.js'

// Types
import { TProduct } from 'src/types/product'

// utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { formatNumberToLocal, isExpiry } from 'src/utils'

// next
import { useRouter } from 'next/router'

// configs
import { ROUTE_CONFIG } from 'src/configs/route'

type TProductCardRelated = {
  item: TProduct
}

const StyledCard = styled(Card)<CardProps>(({ theme }) => {
  return {
    position: 'relative',
    boxShadow: theme.shadows[4],
    '.MuiCardMedia-root.MuiCardMedia-media': {
      objectFit: 'contain'
    }
  }
})

const ProductCardRelated = (props: TProductCardRelated) => {
  // translate
  const { t, i18n } = useTranslation()

  // props
  const { item } = props

  // theme
  const theme = useTheme()
  const router = useRouter()

  const memoIsExpiry = React.useMemo(() => {
    return isExpiry(item?.discountStartDate, item?.discountEndDate)
  }, [item])

  // handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  return (
    <>
      <StyledCard sx={{ width: '100%' }}>
        <CardMedia component='img' height='160' image={item.image} alt='Paella dish' />
        <CardContent sx={{ padding: '8px 12px 12px!important' }}>
          <Typography
            variant='h3'
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              mb: 2
            }}
            onClick={() => handleNavigateDetails(item?.slug)}
          >
            {item?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {item.discount > 0 && memoIsExpiry && (
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: 'bold',
                  textDecoration: 'line-through',
                  fontSize: '14px'
                }}
              >
                {formatNumberToLocal(item?.price)} VND
              </Typography>
            )}
            <Typography variant='h4' sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '18px' }}>
              {item.discount > 0 && memoIsExpiry ? (
                <>{formatNumberToLocal((item?.price * (100 - item.discount)) / 100)}</>
              ) : (
                <>{formatNumberToLocal(item?.price)}</>
              )}{' '}
              VND
            </Typography>
            {item.discount > 0 && memoIsExpiry && (
              <Box
                sx={{
                  backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                  width: '32px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px'
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    color: theme.palette.error.main,
                    fontSize: '10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  - {item?.discount}%
                </Typography>
              </Box>
            )}
          </Box>
          {item.countInStock > 0 ? (
            <>{t('count_in_stock_product', { count: item.countInStock })}</>
          ) : (
            <span>{t('out_of_stock')}</span>
          )}

          {item.sold > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {t('sold_product', { count: item.sold })}
              </Typography>
            </Box>
          )}
          {item?.location?.name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Icon icon='bx:map' />
              <Typography
                variant='h6'
                sx={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  mt: 1
                }}
              >
                {item?.location?.name}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!!item.averageRating && (
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <b>{item.averageRating}</b>
                  <Rating
                    sx={{ fontSize: '16px' }}
                    name='read-only'
                    defaultValue={item?.averageRating}
                    precision={0.5}
                    readOnly
                  />
                </Typography>
              )}
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {!!item.totalReview ? <b>{item.totalReview}</b> : <span>{t('not_review')}</span>}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </>
  )
}

export default ProductCardRelated
