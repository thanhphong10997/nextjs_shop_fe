// React
import * as React from 'react'

// Mui
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { Badge, styled } from '@mui/material'

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
import { addProductToCart } from 'src/stores/order-product'

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

  // auth
  const { user } = useAuth()

  // handle
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
        addProductToCart({
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
                <Icon icon='tdesign:cart' />
              </Badge>
            ) : (
              <Icon icon='tdesign:cart' />
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
      ></Menu>
    </React.Fragment>
  )
}
