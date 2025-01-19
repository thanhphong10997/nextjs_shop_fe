// React
import * as React from 'react'

// Mui
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { Avatar, Badge, Button, MenuItem, MenuItemProps, styled, useTheme } from '@mui/material'

// Hooks
import { useAuth } from 'src/hooks/useAuth'

// Image
import Image from 'next/image'

// Iconify
import { Icon } from '@iconify/react/dist/iconify.js'

// Translate
import { useTranslation } from 'react-i18next'

// router
import { useRouter } from 'next/router'

// Component

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'
import { getLocalProductCart } from 'src/helpers/storage'
import { updateProductToCart } from 'src/stores/order-product'
import { formatNumberToLocal } from 'src/utils'
import { ROUTE_CONFIG } from 'src/configs/route'
import NoData from 'src/components/no-data'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))

const StyledMenuItem = styled(MenuItem)<MenuItemProps>(({ theme }) => {
  return {}
})

export default function CartProduct() {
  // translate
  const { t, i18n } = useTranslation()

  // react
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // router
  const router = useRouter()

  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // handle
  const handleNavigateDetailsProduct = (slug: string) => {
    router.push(`${ROUTE_CONFIG.PRODUCT}/${slug}`)
  }

  const handleNavigateToMyCart = () => {
    router.push(ROUTE_CONFIG.MY_CART)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const totalCartItems = React.useMemo(() => {
    const total = orderItems?.reduce((result, current: TItemOrderProduct) => {
      return result + current.amount
    }, 0)

    return total
  }, [orderItems])

  React.useEffect(() => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: parseData[user?._id] || []
        })
      )
    }
  }, [user])

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('Account')}>
          <IconButton onClick={handleClick} color='inherit'>
            {!!orderItems.length ? (
              <Badge color='primary' badgeContent={totalCartItems}>
                <Icon icon='tdesign:cart' color={theme.palette.mode === 'light' ? '#2F2B3D8a' : '#D0D4F18a'} />
              </Badge>
            ) : (
              <Icon icon='tdesign:cart' color={theme.palette.mode === 'light' ? '#2F2B3D8a' : '#D0D4F18a'} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {orderItems.length > 0 ? (
          <>
            {orderItems.map((item: TItemOrderProduct) => {
              return (
                <StyledMenuItem key={item?.product} onClick={() => handleNavigateDetailsProduct(item.slug)}>
                  <Avatar src={item?.image} />
                  <Box>
                    <Typography>{item?.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {item.discount > 0 && (
                        <Typography
                          variant='h6'
                          sx={{
                            color: theme.palette.error.main,
                            fontWeight: 'bold',
                            textDecoration: 'line-through',
                            fontSize: '10px'
                          }}
                        >
                          {formatNumberToLocal(item?.price)} VND
                        </Typography>
                      )}
                      <Typography
                        variant='h4'
                        sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '12px' }}
                      >
                        {formatNumberToLocal((item?.price * (100 - item.discount)) / 100)} VND
                      </Typography>
                    </Box>
                  </Box>
                </StyledMenuItem>
              )
            })}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                sx={{ mt: 3, mb: 2, mr: 2 }}
                onClick={handleNavigateToMyCart}
              >
                {t('view_cart')}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ width: '200px', padding: '20px' }}>
            <NoData widthImage='60px' heightImage='60px' textNodata={t('no_product')} />
          </Box>
        )}
      </Menu>
    </React.Fragment>
  )
}
