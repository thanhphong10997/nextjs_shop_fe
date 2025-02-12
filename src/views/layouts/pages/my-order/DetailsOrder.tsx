// Import Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// Import Mui
import { Box, useTheme, Typography, Divider, Avatar, Button } from '@mui/material'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// hooks
import { useAuth } from 'src/hooks/useAuth'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { cancelOrderProductOfMeAsync } from 'src/stores/order-product/actions'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'
import { resetInitialState as resetInitialReview } from 'src/stores/reviews'

// components
import Spinner from 'src/components/spinner'

// others
import { TItemOrderProduct, TItemOrderProductMe } from 'src/types/order-product'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react/dist/iconify.js'
import { convertUpdateMultipleCartProduct, formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { getDetailsOrderProductsByMe } from 'src/services/order-product'
import { ROUTE_CONFIG } from 'src/configs/route'
import { PRODUCT_ORDER_STATUS } from 'src/configs/orderProduct'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import WriteReviewModal from './components/WriteReviewModal'
import { PAYMENT_TYPES } from 'src/configs/payment'
import { createURLPaymentVNPay } from 'src/services/payment'
import { formatDate } from 'src/utils/date'

type TProps = {}

export const MyDetailsOrderPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // translate
  const { t, i18n } = useTranslation()

  // const
  const PAYMENT_DATA = PAYMENT_TYPES()

  // router
  const router = useRouter()
  const orderId = router?.query?.orderId as string

  // react
  const [loading, setLoading] = useState(false)
  const [dataOrder, setDataOrder] = useState<TItemOrderProductMe>({} as any)
  const [openCancel, setOpenCancel] = useState(false)
  const [openReview, setOpenReview] = useState({
    open: false,
    userId: '',
    productId: ''
  })

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isSuccessCancelMe, orderItems, isErrorCancelMe, messageErrorCancelMe } = useSelector(
    (state: RootState) => state.orderProduct
  )
  const {
    isSuccessCreate,
    isErrorCreate,
    messageErrorCreate,
    typeError,
    isLoading: loadingReview
  } = useSelector((state: RootState) => state.review)

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

  // handle
  const handleCloseReview = () => {
    setOpenReview({
      open: false,
      productId: '',
      userId: ''
    })
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
        if (response?.data) {
          window.open(response?.data, '_blank')
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  // fetch API
  const handleGetDetailsOrdersOfMe = async () => {
    setLoading(true)
    await getDetailsOrderProductsByMe(orderId).then(res => {
      setDataOrder(res?.data)
      setLoading(false)
    })
  }

  // memo
  const memoDisabledBuyAgain = useMemo(() => {
    return dataOrder?.orderItems?.some(item => !item?.product?.countInStock)
  }, [dataOrder?.orderItems])

  // side Effects

  useEffect(() => {
    if (isSuccessCancelMe) {
      handleCloseCancelDialog()
    }
  }, [isSuccessCancelMe])

  useEffect(() => {
    if (orderId) {
      handleGetDetailsOrdersOfMe()
    }
  }, [orderId])

  useEffect(() => {
    if (isSuccessCancelMe) {
      toast.success(t('cancel_order_success'))
      dispatch(resetInitialState())
      handleGetDetailsOrdersOfMe()
    } else if (isErrorCancelMe && messageErrorCancelMe) {
      toast.error(t('cancel_order_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessCancelMe, isErrorCancelMe, messageErrorCancelMe])

  useEffect(() => {
    if (isSuccessCreate) {
      toast.success(t('write_review_success'))
      dispatch(resetInitialReview())
      handleCloseReview()
    } else if (isErrorCreate && messageErrorCreate) {
      toast.error(t('write_review_error'))
      dispatch(resetInitialReview())
    }
  }, [isSuccessCreate, isErrorCreate, messageErrorCreate])

  return (
    <>
      {loading && <Spinner />}
      <WriteReviewModal
        open={openReview?.open}
        productId={openReview?.productId}
        userId={openReview?.userId}
        onClose={handleCloseReview}
      />
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Button startIcon={<Icon icon='ic:baseline-arrow-back' />} onClick={() => router.back()}>
            {t('back')}
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {dataOrder?.status === +PRODUCT_ORDER_STATUS[2]?.value && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon icon='carbon:delivery' fontSize={20} />
                <Typography>
                  <span style={{ color: theme.palette.success.main }}>{t('order_has_been_delivery')}</span>
                  <span>{' | '}</span>
                </Typography>
              </Box>
            )}
            <Typography sx={{ textTransform: 'uppercase', color: theme.palette.primary.main, fontWeight: 600 }}>
              {t((PRODUCT_ORDER_STATUS as any)[dataOrder?.status]?.label)}
            </Typography>
          </Box>
        </Box>

        <Divider />
        <Box mt={4} mb={4} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
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
                    {dataOrder?.status === +PRODUCT_ORDER_STATUS[2]?.value && (
                      <Button
                        variant='contained'
                        onClick={() =>
                          setOpenReview({
                            open: true,
                            productId: item?.product?._id,
                            userId: user ? user?._id : ' '
                          })
                        }
                      >
                        {t('review')}
                      </Button>
                    )}
                  </Box>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('shipping_address')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.address} {dataOrder?.shippingAddress?.city?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('phone_number')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('order_user_name')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {dataOrder?.shippingAddress?.fullName}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('item_price')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.itemsPrice)} VND
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('shipping_price')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.shippingPrice)} VND
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{t('sum_money')}:</Typography>
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.primary.main }}>
                {formatNumberToLocal(dataOrder?.totalPrice)} VND
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='carbon:delivery' fontSize={20} />
            <Typography>
              {!!dataOrder?.isDelivered ? (
                <>
                  <span style={{ color: theme.palette.success.main, fontSize: '16px' }}>
                    {' '}
                    {t('order_has_been_delivery')}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{formatDate(dataOrder?.deliveryAt)}</span>
                </>
              ) : (
                <span style={{ color: theme.palette.error.main, fontSize: '16px' }}>
                  {t('order_has_not_been_delivery')}
                </span>
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='hugeicons:payment-02' fontSize={20} />
            <Typography>
              {!!dataOrder?.isPaid ? (
                <>
                  <span style={{ color: theme.palette.success.main, fontSize: '16px' }}>
                    {' '}
                    {t('order_has_been_paid')}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}> {formatDate(dataOrder?.paidAt)}</span>
                </>
              ) : (
                <span style={{ color: theme.palette.error.main, fontSize: '16px' }}>
                  {t('order_has_not_been_paid')}
                </span>
              )}
            </Typography>
          </Box>
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
            disabled={memoDisabledBuyAgain}
            onClick={handleBuyAgain}
          >
            {t('buy_again')}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default MyDetailsOrderPage
