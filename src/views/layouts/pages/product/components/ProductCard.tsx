// React
import * as React from 'react'

// Mui
import { styled, useTheme } from '@mui/material/styles'
import Card, { CardProps } from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box, Button, Rating } from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'

// Icon
import { Icon } from '@iconify/react/dist/iconify.js'

// Types
import { TProduct } from 'src/types/product'

// utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'

// next
import { useRouter } from 'next/router'

// configs
import { ROUTE_CONFIG } from 'src/configs/route'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'

// storage
import { updateProductToCart } from 'src/stores/order-product'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { likeProductAsync, unLikeProductAsync } from 'src/stores/product/actions'

type TProductCard = {
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

const ProductCard = (props: TProductCard) => {
  // translate
  const { t, i18n } = useTranslation()

  // props
  const { item } = props

  // theme
  const theme = useTheme()
  const router = useRouter()

  const { user } = useAuth()

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)

  const memoIsExpiry = React.useMemo(() => {
    return isExpiry(item?.discountStartDate, item?.discountEndDate)
  }, [item])

  // handle
  const handleNavigateDetails = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleToggleProduct = (id: string, isLiked: boolean) => {
    if (user?._id) {
      if (isLiked) {
        dispatch(unLikeProductAsync({ productId: id }))
      } else {
        dispatch(likeProductAsync({ productId: id }))
      }
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const discountItem = isExpiry(item?.discountStartDate, item?.discountEndDate) ? item?.discount : 0
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item?.name,
      amount: 1,
      image: item?.image,
      price: item?.price,
      discount: discountItem,
      product: item?._id,
      slug: item?.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  const handleBuyProductToCart = (item: TProduct) => {
    handleUpdateProductToCart(item)

    // ROUTE_CONFIG.MY_CART is the custom URL so the cart page won't show the query on the router and the query data will be gone if the page reloads
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,

        query: {
          selected: item?._id
        }
      },
      ROUTE_CONFIG.MY_CART
    )
  }

  return (
    <>
      <StyledCard sx={{ width: '100%' }}>
        <CardMedia component='img' height='194' image={item.image} alt='Paella dish' />
        <CardContent sx={{ padding: '8px 12px' }}>
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
              minHeight: '48px',
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
            <Box
              sx={{
                backgroundColor: hexToRGBA(theme.palette.error.main, 0.42),
                width: '60px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                my: 1
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: theme.palette.error.main,
                  fontSize: '12px',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {t('out_of_stock')}
              </Typography>
            </Box>
          )}

          {item.sold > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {t('sold')} <b>{item?.sold}</b> {t('product')}
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
            <IconButton
              onClick={() => handleToggleProduct(item?._id, Boolean(user && item?.likedBy?.includes(user?._id)))}
            >
              {user && item?.likedBy?.includes(user?._id) ? (
                <Icon icon='mdi:heart' />
              ) : (
                <Icon icon='mdi-light:heart' style={{ color: theme.palette.primary.main }} />
              )}
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
          <Button
            fullWidth
            disabled={item?.countInStock < 1}
            type='submit'
            variant='outlined'
            color='primary'
            sx={{ height: '40px', display: 'flex' }}
            onClick={() => handleUpdateProductToCart(item)}
          >
            {t('add_to_cart')}
          </Button>
          <Button
            fullWidth
            disabled={item?.countInStock < 1}
            type='submit'
            variant='contained'
            color='primary'
            sx={{ height: '40px', display: 'flex' }}
            onClick={() => handleBuyProductToCart(item)}
          >
            {t('buy_now')}
          </Button>
        </Box>
      </StyledCard>
    </>
  )
}

export default ProductCard
