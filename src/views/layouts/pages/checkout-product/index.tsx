'use client'

// Import Next
import { NextPage } from 'next'

// Import Mui
import {
  Box,
  Button,
  useTheme,
  Avatar,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'

// Import React
import React, { Fragment, useEffect, useMemo, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// utils
import { formatNumberToLocal, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// hooks
import { useAuth } from 'src/hooks/useAuth'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'
import { createOrderProductAsync } from 'src/stores/order-product/actions'

// components
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'

// services
import { getAllPaymentTypes } from 'src/services/payment-type'
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { resetInitialState } from 'src/stores/order-product'
import toast from 'react-hot-toast'

type TProps = {}

export const CheckoutProductPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // translate
  const { t, i18n } = useTranslation()

  // router
  const router = useRouter()

  // react
  const [loading, setLoading] = useState(false)
  const [paymentOptions, setPaymentOptions] = useState<{ label: string; value: string }[]>([])
  const [deliveryOptions, setDeliveryOptions] = useState<{ label: string; value: string; price: string }[]>([])
  const [paymentSelected, setPaymentSelected] = useState('')
  const [deliverySelected, setDeliverySelected] = useState('')

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessCreate, isErrorCreate, typeError, messageErrorCreate } = useSelector(
    (state: RootState) => state.orderProduct
  )

  // memo

  // get data from query string of router
  const memoQueryProduct = useMemo(() => {
    const result = {
      totalPrice: 0,
      selectedProduct: []
    }
    const data: any = router.query
    if (data) {
      result.totalPrice = data?.totalPrice || 0
      result.selectedProduct = data.productSelected ? JSON.parse(data.productSelected) : []
    }

    return result
  }, [router.query])

  // handle
  const onChangeDelivery = (value: string) => {
    setDeliverySelected(value)
  }

  const onChangePayment = (value: string) => {
    setPaymentSelected(value)
  }

  // fetch api
  const handleGetListPaymentMethod = async () => {
    await getAllPaymentTypes({ params: { limit: -1, page: -1 } }).then(res => {
      if (res?.data) {
        setPaymentOptions(
          res?.data?.paymentTypes?.map((item: { name: string; _id: string }) => {
            return {
              label: item?.name,
              value: item?._id
            }
          })
        )
        setPaymentSelected(res?.data?.paymentTypes?.[0]?._id)
      }
    })
  }

  const handleGetListDeliveryMethod = async () => {
    await getAllDeliveryTypes({ params: { limit: -1, page: -1 } }).then(res => {
      if (res?.data) {
        setDeliveryOptions(
          res?.data?.deliveryTypes?.map((item: { name: string; _id: string; price: string }) => {
            return {
              label: item?.name,
              value: item?._id,
              price: item?.price
            }
          })
        )
        setDeliverySelected(res?.data?.deliveryTypes?.[0]?._id)
      }
    })
  }

  const handleOrderProduct = () => {
    const findItemPrice = deliveryOptions?.find(item => item?.value === deliverySelected)
    const shippingPrice = findItemPrice ? +findItemPrice?.price : 0
    const totalPrice = +shippingPrice + Number(memoQueryProduct?.totalPrice)
    dispatch(
      createOrderProductAsync({
        orderItems: memoQueryProduct?.selectedProduct,
        itemsPrice: +memoQueryProduct?.totalPrice,
        paymentMethod: paymentSelected,
        deliveryMethod: deliverySelected,
        user: user ? user?._id : '',
        fullName: user
          ? toFullName(user?.lastName || '', user?.middleName || '', user?.firstName || '', i18n.language) || 'Phong'
          : '',
        address: user ? user?.address || 'HCM' : '',
        city: user ? user?.city : '',
        phone: user ? user?.phoneNumber : '',
        shippingPrice: shippingPrice,
        totalPrice: totalPrice
      })
    )
  }

  useEffect(() => {
    handleGetListPaymentMethod()
    handleGetListDeliveryMethod()
  }, [])

  useEffect(() => {
    if (isSuccessCreate) {
      toast.success(t('create_product_order_success'))
      dispatch(resetInitialState())
    } else if (isErrorCreate && messageErrorCreate) {
      toast.error(t('create_product_order_error'))
      dispatch(resetInitialState())
    }
  }, [isSuccessCreate, isErrorCreate, messageErrorCreate])

  return (
    <>
      {/* {(isLoading || loading) && <Spinner />} */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        {memoQueryProduct?.selectedProduct?.length > 0 ? (
          <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', mb: '10px' }}>
              <Typography sx={{ width: '80px', fontWeight: 600 }}>{t('image')}</Typography>
              <Typography sx={{ flexBasis: '35%', fontWeight: 600, marginLeft: '20px' }}>
                {t('product_name')}
              </Typography>
              <Typography sx={{ flexBasis: '20%', fontWeight: 600 }}>{t('original_price')}</Typography>
              <Typography sx={{ flexBasis: '20%', fontWeight: 600 }}>{t('discount_price')}</Typography>
              <Typography sx={{ flexBasis: '10%', fontWeight: 600 }}>{t('count')}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
              {memoQueryProduct?.selectedProduct?.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mt: '16px' }}>
                      <Avatar sx={{ width: '100px', height: '100px', borderRadius: 0 }} src={item?.image} />
                      <Typography
                        sx={{
                          fontSize: '20px',
                          flexBasis: '35%',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          mt: 2
                        }}
                      >
                        {item?.name}
                      </Typography>
                      <Box sx={{ flexBasis: '20%' }}>
                        <Typography
                          variant='h6'
                          mt={2}
                          sx={{
                            color: item?.discount ? theme.palette.error.main : theme.palette.primary.main,
                            fontWeight: 'bold',
                            textDecoration: item?.discount ? 'line-through' : 'normal',
                            fontSize: '18px'
                          }}
                        >
                          {formatNumberToLocal(item?.price)} VND
                        </Typography>
                      </Box>
                      <Box sx={{ flexBasis: '20%', display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.discount > 0 && (
                          <Typography
                            variant='h4'
                            mt={2}
                            sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '18px' }}
                          >
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
                      <Box sx={{ flexBasis: '10%' }}>
                        <Typography
                          variant='h6'
                          mt={2}
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            fontSize: '18px'
                          }}
                        >
                          {item?.amount}
                        </Typography>
                      </Box>
                    </Box>
                    {index !== memoQueryProduct?.selectedProduct?.length - 1 && <Divider />}
                  </Fragment>
                )
              })}
            </Box>
          </Fragment>
        ) : (
          <Box sx={{ width: '100%', padding: '20px' }}>
            {' '}
            <NoData widthImage='100px' heightImage='100px' textNodata={t('no_product')} />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>{t('sum_money')}:</Typography>
          <Typography sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.primary.main }}>
            {formatNumberToLocal(memoQueryProduct?.totalPrice)} VND
          </Typography>
        </Box>
      </Box>

      {/* Delivery method */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px',
          mt: 6
        }}
      >
        <Box>
          <FormControl sx={{ flexDirection: 'row !important', gap: 10 }}>
            <FormLabel
              id='radio-delivery-group'
              sx={{ color: theme.palette.primary.main, fontWeight: 600, minWidth: '220px' }}
            >
              {t('select_delivery_type')}
            </FormLabel>
            <RadioGroup
              sx={{ position: 'relative', top: '-8px' }}
              aria-labelledby='radio-delivery-group'
              name='radio-delivery-group'
              onChange={e => onChangeDelivery(e.target.value)}
            >
              {deliveryOptions.map(delivery => {
                return (
                  <FormControlLabel
                    key={delivery.value}
                    value={delivery.value}
                    control={<Radio checked={deliverySelected === delivery.value} />}
                    label={delivery.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
        {/* Payment method */}
        <Box
          sx={{
            mt: 4
          }}
        >
          <FormControl sx={{ flexDirection: 'row !important', gap: 10 }}>
            <FormLabel
              id='radio-payment-group'
              sx={{ color: theme.palette.primary.main, fontWeight: 600, minWidth: '220px' }}
            >
              {t('select_payment_type')}
            </FormLabel>
            <RadioGroup
              sx={{ position: 'relative', top: '-8px' }}
              aria-labelledby='radio-payment-group'
              name='radio-payment-group'
              onChange={e => onChangePayment(e.target.value)}
            >
              {paymentOptions.map(payment => {
                return (
                  <FormControlLabel
                    key={payment.value}
                    value={payment.value}
                    control={<Radio checked={paymentSelected === payment.value} />}
                    label={payment.label}
                  />
                )
              })}
            </RadioGroup>
          </FormControl>
        </Box>
        {/* Payment method */}
      </Box>
      {/* Delivery method */}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 4 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{ height: '40px', display: 'flex' }}
          onClick={handleOrderProduct}
        >
          {t('order_now')}
        </Button>
      </Box>
    </>
  )
}

export default CheckoutProductPage
