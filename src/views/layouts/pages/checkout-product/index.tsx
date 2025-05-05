// Import Next
import { NextPage } from 'next'

// Import Mui
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme
} from '@mui/material'

// Import React
import { Fragment, useEffect, useMemo, useState } from 'react'

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
import { createOrderProductAsync } from 'src/stores/order-product/actions'
import { TItemOrderProduct } from 'src/types/order-product'

// components
import { useRouter } from 'next/router'
import NoData from 'src/components/no-data'

// services
import { Icon } from '@iconify/react/dist/iconify.js'
import Spinner from 'src/components/spinner'
import { getAllCities } from 'src/services/city'
import { getAllDeliveryTypes } from 'src/services/delivery-type'
import { getAllPaymentTypes } from 'src/services/payment-type'
import { resetInitialState, updateProductToCart } from 'src/stores/order-product'
import ModalAddAddress from './components/ModalAddAddress'
import ModalWarning from './components/ModalWarning'

// alert
import { PAYMENT_TYPES } from 'src/configs/payment'
import { ROUTE_CONFIG } from 'src/configs/route'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { createURLPaymentVNPay } from 'src/services/payment'
import Swal from 'sweetalert2'

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
  const [paymentOptions, setPaymentOptions] = useState<{ label: string; value: string; type: string }[]>([])
  const [deliveryOptions, setDeliveryOptions] = useState<{ label: string; value: string; price: string }[]>([])
  const [paymentSelected, setPaymentSelected] = useState('')
  const [deliverySelected, setDeliverySelected] = useState('')
  const [openAddress, setOpenAddress] = useState(false)
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])
  const [openWarning, setOpenWarning] = useState(false)

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessCreate, isErrorCreate, messageCreate, orderItems } = useSelector(
    (state: RootState) => state.orderProduct
  )

  // const
  const PAYMENT_DATA = PAYMENT_TYPES()

  // memo
  const memoDefaultAddress = useMemo(() => {
    const findDefaultAddress = user?.addresses?.find(address => address.isDefault)

    return findDefaultAddress
  }, [user?.addresses])

  const memoNameCity = useMemo(() => {
    if (memoDefaultAddress) {
      const findCity = citiesOption?.find(city => city?.value === memoDefaultAddress?.city)

      return findCity?.label
    }

    return ''
  }, [memoDefaultAddress, citiesOption])

  const memoShippingPrice = useMemo(() => {
    const findItemPrice = deliveryOptions?.find(item => item?.value === deliverySelected)
    const shippingPrice = findItemPrice ? +findItemPrice?.price : 0

    return shippingPrice
  }, [deliverySelected])

  const handleFormatProductData = (items: any) => {
    const objectMap: Record<string, TItemOrderProduct> = {}
    orderItems?.forEach((order: any) => {
      objectMap[order?.product?._id] = order
    })

    return items?.map((item: any) => ({
      ...objectMap[item?.product],
      amount: item?.amount
    }))
  }

  // get data from query string of router
  const memoQueryProduct = useMemo(() => {
    const result = {
      totalPrice: 0,
      selectedProduct: []
    }
    const data: any = router.query
    if (data) {
      result.totalPrice = data?.totalPrice || 0
      result.selectedProduct = data.productSelected ? handleFormatProductData(JSON.parse(data.productSelected)) : []
    }

    return result
  }, [router.query, orderItems])

  // handle
  const onChangeDelivery = (value: string) => {
    setDeliverySelected(value)
  }

  const onChangePayment = (value: string) => {
    setPaymentSelected(value)
  }

  // handle
  const handleGetListPaymentMethod = async () => {
    setLoading(true)
    await getAllPaymentTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        if (res?.data) {
          setPaymentOptions(
            res?.data?.paymentTypes?.map((item: { name: string; _id: string; type: string }) => {
              return {
                label: item?.name,
                value: item?._id,
                type: item?.type
              }
            })
          )
          setPaymentSelected(res?.data?.paymentTypes?.[0]?._id)
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  const handleGetListDeliveryMethod = async () => {
    setLoading(true)
    await getAllDeliveryTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
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
      .catch(e => {
        setLoading(false)
      })
  }

  const handleOrderProduct = () => {
    // fix bug that if user did not enter the address and process the order
    if (!memoDefaultAddress) {
      setOpenAddress(true)

      return
    }

    /*******/
    const totalPrice = +memoShippingPrice + Number(memoQueryProduct?.totalPrice)
    dispatch(
      createOrderProductAsync({
        orderItems: memoQueryProduct?.selectedProduct,
        itemsPrice: +memoQueryProduct?.totalPrice,
        paymentMethod: paymentSelected,
        deliveryMethod: deliverySelected,
        user: user ? user?._id : '',
        fullName: memoDefaultAddress
          ? toFullName(
              memoDefaultAddress?.lastName || '',
              memoDefaultAddress?.middleName || '',
              memoDefaultAddress?.firstName || '',
              i18n.language
            )
          : '',
        address: memoDefaultAddress ? memoDefaultAddress?.address : '',
        city: memoDefaultAddress ? memoDefaultAddress?.city : '',
        phone: memoDefaultAddress ? memoDefaultAddress?.phoneNumber : '',
        shippingPrice: memoShippingPrice,
        totalPrice: totalPrice
      })
    ).then(res => {
      const paymentMethodId = res?.payload?.data?.paymentMethod
      const orderId = res?.payload?.data?._id
      const totalPrice = res?.payload?.data?.totalPrice
      const findPayment = paymentOptions?.find(item => item?.value === paymentMethodId)
      if (findPayment) {
        handlePaymentTypeOrder(findPayment?.type, { totalPrice, orderId })
      }
    })
  }

  const handleChangeAmountCart = (items: TItemOrderProduct[]) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const objectMap: Record<string, number> = {}
    items.forEach(item => {
      objectMap[item?.product?._id] = -item?.amount
    })
    const listOrderItems: TItemOrderProduct[] = []

    // orderItems means every product which added to the cart
    orderItems.forEach((cartItem: TItemOrderProduct) => {
      // check if the selected product is existed in the objectMap
      if (objectMap[cartItem?.product?._id]) {
        listOrderItems.push({
          ...cartItem,

          // amount of the product after place order will be calculated by the amount of the product in the cart minus the amount of the product in checkout step
          amount: cartItem?.amount + objectMap[cartItem?.product?._id]
        })
      } else {
        listOrderItems.push(cartItem)
      }
    })

    const filterOrderList = listOrderItems?.filter(item => item?.amount)

    if (user) {
      dispatch(
        updateProductToCart({
          // filter to get the product have amount > 0
          orderItems: filterOrderList
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filterOrderList })
    }
  }

  const handlePaymentTypeOrder = (type: string, data: { orderId: string; totalPrice: number }) => {
    switch (type) {
      case PAYMENT_DATA?.VN_PAYMENT?.value: {
        handlePaymentVNPay(data)
        break
      }
      default:
        break
    }
  }

  const handlePaymentVNPay = async (data: { orderId: string; totalPrice: number }) => {
    setLoading(true)
    await createURLPaymentVNPay({
      totalPrice: data?.totalPrice,
      orderId: data?.orderId,
      language: i18n.language === 'vi' ? 'vn' : i18n.language
    })
      .then(response => {
        // console.log('response', response.data)
        if (response?.data) {
          window.open(response?.data, '_blank')
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  // fetch api
  const fetchAllCities = async () => {
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.cities
        if (data) {
          setCitiesOption(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleGetListPaymentMethod()
    handleGetListDeliveryMethod()
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (isSuccessCreate) {
      Swal.fire({
        title: t('Congratulation!'),
        text: t('create_product_order_success'),
        icon: 'success',
        confirmButtonText: t('confirm'),
        background: theme.palette.background.paper,
        color: `${theme.palette.customColors.main}c7`
      }).then(result => {
        if (result?.isConfirmed) {
          router.push(ROUTE_CONFIG.MY_ORDER)
        }
      })

      // decrease the amount of the product in cart after order has been created
      handleChangeAmountCart(memoQueryProduct.selectedProduct)

      // memoQueryProduct.selectedProduct?.map((item: TItemOrderProduct) => handleChangeAmountCart(item, -item?.amount))
      dispatch(resetInitialState())
    } else if (isErrorCreate && messageCreate) {
      Swal.fire({
        title: t('Opps!'),
        text: t('create_product_order_error'),
        icon: 'error',
        confirmButtonText: t('confirm'),
        background: theme.palette.background.paper,
        color: `${theme.palette.customColors.main}c7`
      })
      dispatch(resetInitialState())
    }
  }, [isSuccessCreate, isErrorCreate, messageCreate])

  useEffect(() => {
    const data: any = router.query
    if (!data?.productSelected) {
      setOpenWarning(true)
    }
  }, [router.query])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
      <ModalWarning open={openWarning} onClose={() => setOpenAddress(false)} />
      <ModalAddAddress open={openAddress} onClose={() => setOpenAddress(false)} />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          padding: '40px',
          width: '100%',
          borderRadius: '15px',
          mb: 6
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='bx:map' style={{ color: theme.palette.primary.main }} />
            <Typography
              variant='h6'
              sx={{
                fontSize: '18px',
                fontWeight: 'bold',
                mt: 1,
                color: theme.palette.primary.main
              }}
            >
              {t('shipping_address')}
            </Typography>
          </Box>
          <Box>
            {user && user?.addresses?.length > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {memoDefaultAddress?.phoneNumber}{' '}
                  {toFullName(
                    memoDefaultAddress?.lastName || '',
                    memoDefaultAddress?.middleName || '',
                    memoDefaultAddress?.firstName || '',
                    i18n.language
                  )}
                </Typography>
                <Typography component='span' sx={{ fontSize: '18px' }}>
                  {memoDefaultAddress?.address} {memoNameCity}
                </Typography>
                <Button
                  sx={{ border: `1px solid ${theme.palette.primary.main}` }}
                  onClick={() => {
                    setOpenAddress(true)
                  }}
                >
                  {t('Change')}
                </Button>
              </Box>
            ) : (
              <Button sx={{ border: `1px solid ${theme.palette.primary.main}` }} onClick={() => setOpenAddress(true)}>
                {t('add_address')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
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
                  <Fragment key={item?.product?._id}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontSize: '20px', minWidth: '200px' }}>{t('item_price')}:</Typography>
            <Typography sx={{ fontSize: '20px', minWidth: '200px' }}>
              {formatNumberToLocal(memoQueryProduct?.totalPrice)} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontSize: '20px', minWidth: '200px' }}>{t('shipping_price')}:</Typography>
            <Typography sx={{ fontSize: '20px', minWidth: '200px' }}>
              {formatNumberToLocal(memoShippingPrice)} VND
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontSize: '20px', minWidth: '200px', fontWeight: 600 }}>{t('sum_money')}:</Typography>
            <Typography
              sx={{ fontSize: '20px', color: theme.palette.primary.main, minWidth: '200px', fontWeight: 600 }}
            >
              {formatNumberToLocal(+memoQueryProduct?.totalPrice + +memoShippingPrice)} VND
            </Typography>
          </Box>
        </Box>
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
