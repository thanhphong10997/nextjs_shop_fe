// Import Next
import { NextPage } from 'next'

// Import Mui
import { Box, Button, useTheme, Avatar, Typography, Divider } from '@mui/material'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// utils
import { convertUpdateMultipleCartProduct, convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct, TItemOrderProductMe } from 'src/types/order-product'
import { cancelOrderProductOfMeAsync } from 'src/stores/order-product/actions'

// components
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { PRODUCT_ORDER_STATUS } from 'src/configs/orderProduct'
import { Icon } from '@iconify/react/dist/iconify.js'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { updateProductToCart } from 'src/stores/order-product'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { PAYMENT_TYPES } from 'src/configs/payment'
import { createURLPaymentVNPay } from 'src/services/payment'
import Spinner from 'src/components/spinner'

type TProps = {
  dataOrder: TItemOrderProductMe
}

export const OrderCard: NextPage<TProps> = props => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // redux
  const { isSuccessCancelMe, orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // props
  const { dataOrder } = props

  // hooks
  const { user } = useAuth()
  const router = useRouter()

  // const
  const PAYMENT_DATA = PAYMENT_TYPES()

  // react
  const [openCancel, setOpenCancel] = useState(false)
  const [loading, setLoading] = useState(false)

  // handle
  const handleConfirmCancel = () => {
    dispatch(cancelOrderProductOfMeAsync(dataOrder?._id))
  }

  const handleCloseCancelDialog = () => {
    setOpenCancel(false)
  }

  const handleUpdateProductToCart = (items: TItemOrderProduct[]) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateMultipleCartProduct(orderItems, items)

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  const handleBuyAgain = () => {
    handleUpdateProductToCart(dataOrder?.orderItems)

    // ROUTE_CONFIG.MY_CART is the custom URL so the cart page won't show the query on the router and the query data will be gone if the page reloads
    router.push(
      {
        pathname: ROUTE_CONFIG.MY_CART,

        query: {
          selected: dataOrder?.orderItems?.map((item: TItemOrderProduct) => item?.product?._id)
        }
      },

      ROUTE_CONFIG.MY_CART
    )
  }

  const handleNavigateDetailsOrder = () => {
    router.push(`${ROUTE_CONFIG.MY_ORDER}/${dataOrder?._id}`)
  }

  const handlePaymentTypeOrder = (type: string) => {
    switch (type) {
      case PAYMENT_DATA?.VN_PAYMENT?.value: {
        handlePaymentVNPay()
        break
      }
      default:
        break
    }
  }

  const handlePaymentVNPay = async () => {
    setLoading(true)
    await createURLPaymentVNPay({
      totalPrice: dataOrder?.totalPrice,
      orderId: dataOrder?._id,
      language: i18n.language === 'vi' ? 'vn' : i18n.language
    })
      .then(response => {
        console.log('response', { response })
        if (response?.data) {
          window.open(response?.data, '_blank')
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  // memo
  const memoDisabledBuyAgain = useMemo(() => {
    return dataOrder?.orderItems?.some(item => !item?.product?.countInStock)
  }, [dataOrder?.orderItems])

  useEffect(() => {
    if (isSuccessCancelMe) {
      handleCloseCancelDialog()
    }
  }, [isSuccessCancelMe])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        title={t('title_cancel_order')}
        description={t('confirm_cancel_order')}
        open={openCancel}
        handleClose={handleCloseCancelDialog}
        handleCancel={handleCloseCancelDialog}
        handleConfirm={handleConfirmCancel}
      />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
          {!!dataOrder?.isDelivered && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon='carbon:delivery' fontSize={20} />
              <Typography>
                <span style={{ color: theme.palette.success.main }}>{t('order_has_been_delivery')}</span>
                <span>{' | '}</span>
              </Typography>
            </Box>
          )}
          {!!dataOrder?.isPaid && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Icon icon='hugeicons:payment-02' fontSize={20} />
              <Typography>
                <span style={{ color: theme.palette.success.main }}>{t('order_has_been_paid')}</span>
                <span>{' | '}</span>
              </Typography>
            </Box>
          )}
          <Typography sx={{ textTransform: 'uppercase', color: theme.palette.primary.main, fontWeight: 600 }}>
            {t((PRODUCT_ORDER_STATUS as any)[dataOrder?.status].label)}
          </Typography>
        </Box>

        <Divider />
        <Box
          mt={4}
          mb={4}
          sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          onClick={handleNavigateDetailsOrder}
        >
          {dataOrder?.orderItems?.map((item: TItemOrderProduct) => {
            return (
              <Box key={item?.product?._id} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Box sx={{ border: `1px solid ${theme.palette.customColors.main}33` }}>
                  <Avatar
                    sx={{
                      width: '100px',
                      height: '100px',
                      borderRadius: 0,
                      border: `1px solid ${theme.palette.customColors.main}33`
                    }}
                    src={item?.image}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block'
                    }}
                  >
                    {item?.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        color: item?.discount ? theme.palette.error.main : theme.palette.primary.main,
                        textDecoration: item?.discount ? 'line-through' : 'normal',
                        fontSize: '14px'
                      }}
                    >
                      {formatNumberToLocal(item?.price)} VND
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.discount > 0 && (
                        <Typography variant='h4' sx={{ color: theme.palette.primary.main, fontSize: '14px' }}>
                          {formatNumberToLocal((item?.price * (100 - item.discount)) / 100)} VND
                        </Typography>
                      )}
                      {item.discount > 0 && (
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
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '14px'
                    }}
                  >
                    x {item?.amount}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('sum_money')}:</Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
            {formatNumberToLocal(dataOrder?.totalPrice)} VND
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            mt: 6
          }}
        >
          {[0].includes(dataOrder?.status) && dataOrder?.paymentMethod?.type !== PAYMENT_DATA?.PAYMENT_LATER?.value && (
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              sx={{
                height: '40px',
                display: 'flex',
                backgroundColor: 'transparent!important'
              }}
              onClick={() => handlePaymentTypeOrder(dataOrder?.paymentMethod?.type)}
            >
              {t('payment')}
            </Button>
          )}
          {[0, 1].includes(dataOrder?.status) && (
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              sx={{
                height: '40px',
                display: 'flex',
                color: '#da251d',
                border: '1px solid #da251d!important',
                backgroundColor: 'transparent!important'
              }}
              onClick={() => setOpenCancel(true)}
            >
              {t('cancel_order')}
            </Button>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ height: '40px', display: 'flex' }}
            onClick={handleBuyAgain}
            disabled={memoDisabledBuyAgain}
          >
            {t('buy_again')}
          </Button>
          <Button type='submit' variant='outlined' color='primary' sx={{ height: '40px', display: 'flex' }}>
            {t('view_details')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default OrderCard
