// React
import * as React from 'react'

// Mui
import { styled, useTheme } from '@mui/material/styles'
import Card, { CardProps } from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'

// Icon
import { Icon } from '@iconify/react/dist/iconify.js'

// Types
import { TProduct } from 'src/types/product'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProductCard = {
  item: TProduct
}

const StyledCard = styled(Card)<CardProps>(({ theme }) => {
  return {
    position: 'relative',
    boxShadow: theme.shadows[4]
  }
})

const ProductCard = (props: TProductCard) => {
  // translate
  const { t, i18n } = useTranslation()

  const { item } = props

  const theme = useTheme()

  return (
    <>
      <StyledCard sx={{ width: '100%' }}>
        <CardMedia component='img' height='194' image={item.image} alt='Paella dish' />
        <CardContent sx={{ padding: '8px 12px' }}>
          <Typography variant='h3' sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            {item?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {item.discount > 0 && (
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: 'bold',
                  textDecoration: 'line-through',
                  fontSize: '14px'
                }}
              >
                {item?.price} VND
              </Typography>
            )}
            <Typography variant='h4' sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '18px' }}>
              {(item?.price * (100 - item.discount)) / 100} VND
            </Typography>
            {item.discount > 0 && (
              <Box
                sx={{
                  backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                  width: '25px',
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
                    fontSize: '10px'
                  }}
                >
                  {item?.discount}%
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!!item.averageRating && (
                <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                  <b>5</b>
                  <Icon icon='fluent-color:star-16' fontSize={16} style={{ position: 'relative', top: '-1' }} />
                </Typography>
              )}
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {!!item.totalReview ? <b>{item.totalReview}</b> : <span>{t('not_review')}</span>}
              </Typography>
            </Box>
            <IconButton>
              <Icon icon='mdi:heart' />
            </IconButton>
          </Box>
        </CardContent>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
            padding: '0 12px 10px',
            gap: 2
          }}
        >
          <Button fullWidth type='submit' variant='outlined' color='primary' sx={{ height: '40px', display: 'flex' }}>
            {t('add_to_cart')}
          </Button>
          <Button fullWidth type='submit' variant='contained' color='primary' sx={{ height: '40px', display: 'flex' }}>
            {t('buy_now')}
          </Button>
        </Box>
      </StyledCard>
    </>
  )
}

export default ProductCard
