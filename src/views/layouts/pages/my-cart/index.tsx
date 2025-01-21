'use client'

// Import Next
import { NextPage } from 'next'

// Import Mui
import {
  Box,
  Button,
  useTheme,
  Avatar,
  IconButton,
  TextField,
  Typography,
  Checkbox,
  Tooltip,
  Divider
} from '@mui/material'

// Import React
import React, { Fragment, useEffect, useMemo, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// iconify
import { Icon } from '@iconify/react/dist/iconify.js'

// utils
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// hooks
import { useAuth } from 'src/hooks/useAuth'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { TItemOrderProduct } from 'src/types/order-product'
import { updateProductToCart } from 'src/stores/order-product'

// helpers
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import NoData from 'src/components/no-data'

type TProps = {}

export const MyCartPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [loading, setLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  const memoListAllProducts = useMemo(() => {
    return orderItems.map((item: TItemOrderProduct) => item?.product)
  }, [orderItems])

  // handle

  const handleChangeAmountCart = (item: TItemOrderProduct, amount: number) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item?.name,
      amount: amount,
      image: item?.image,
      price: item?.price,
      discount: item?.discount,
      product: item?.product,
      slug: item?.slug
    })
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    }
  }

  const handleDeleteProductCart = (id: string) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems)
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => item?.product !== id)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filteredItems })
    }
  }

  const handleChangeCheckbox = (value: string) => {
    const isChecked = selectedRows.includes(value)
    if (isChecked) {
      const filteredItems = selectedRows.filter(item => item !== value)
      setSelectedRows(filteredItems)
    } else {
      setSelectedRows([...selectedRows, value])
    }
  }

  const handleChangeCheckAll = () => {
    const isCheckedAll = memoListAllProducts.every(id => selectedRows.includes(id))
    if (isCheckedAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(memoListAllProducts)
    }
  }

  const handleDeleteMany = () => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const cloneOrderItems = cloneDeep(orderItems)

    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => !selectedRows.includes(item?.product))

    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filteredItems })
    }
  }

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
        {orderItems.length > 0 ? (
          <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px', mb: '10px' }}>
              <Box sx={{ width: '5%' }}>
                <Tooltip title={t('select_all')}>
                  <Checkbox
                    checked={memoListAllProducts.every(id => selectedRows.includes(id))}
                    onChange={handleChangeCheckAll}
                  />
                </Tooltip>
              </Box>
              <Typography sx={{ width: '80px', fontWeight: 600 }}>{t('image')}</Typography>
              <Typography sx={{ flexBasis: '35%', fontWeight: 600, marginLeft: '20px' }}>
                {t('product_name')}
              </Typography>
              <Typography sx={{ flexBasis: '20%', fontWeight: 600 }}>{t('original_price')}</Typography>
              <Typography sx={{ flexBasis: '20%', fontWeight: 600 }}>{t('discount_price')}</Typography>
              <Typography sx={{ flexBasis: '10%', fontWeight: 600 }}>{t('count')}</Typography>
              <Box sx={{ flexBasis: '5%', display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title={t('delete_all')}>
                  <IconButton disabled={!selectedRows.length} onClick={handleDeleteMany}>
                    <Icon icon='ic:outline-delete' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
              {orderItems?.map((item: TItemOrderProduct, index: number) => {
                return (
                  <Fragment key={item.product}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mt: '16px' }}>
                      <Box sx={{ width: '5%' }}>
                        <Checkbox
                          checked={selectedRows.includes(item?.product)}
                          value={item?.product}
                          onChange={e => {
                            handleChangeCheckbox(e.target.value)
                          }}
                        />
                      </Box>
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
                      <Box sx={{ flexBasis: '10%', mt: 2, display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          sx={{
                            backgroundColor: `${theme.palette.primary.main}`,
                            color: `${theme.palette.common.white}`,
                            '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                          }}
                          onClick={() => handleChangeAmountCart(item, -1)}
                        >
                          <Icon icon='lucide:minus' fontSize={12} />
                        </IconButton>
                        <TextField
                          type='number'
                          value={item?.amount}
                          sx={{
                            '.MuiInputBase-root.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'transparent'
                            },
                            '.MuiInputBase-input.MuiOutlinedInput-input': {
                              width: '30px',
                              padding: '4px 8px',
                              textAlign: 'center'
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'transparent'
                            },

                            // Hide increase/decrease button
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                              display: 'none'
                            },
                            '& input[type=number]': {
                              MozAppearance: 'textfield'
                            }

                            // Hide increase/decrease button
                          }}
                          inputProps={{
                            inputMode: 'numeric',
                            min: 1

                            // max: dataProduct?.countInStock
                          }}
                        />
                        <IconButton
                          sx={{
                            backgroundColor: `${theme.palette.primary.main}`,
                            color: `${theme.palette.common.white}`,
                            '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                          }}
                          onClick={() => handleChangeAmountCart(item, 1)}
                        >
                          <Icon icon='meteor-icons:plus' fontSize={12} />
                        </IconButton>
                      </Box>
                      <Box sx={{ flexBasis: '5%', mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => handleDeleteProductCart(item?.product)}>
                          <Icon icon='ic:outline-delete' />
                        </IconButton>
                      </Box>
                    </Box>
                    {index !== orderItems.length - 1 && <Divider />}
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
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={!selectedRows.length}
          sx={{ height: '40px', display: 'flex' }}
        >
          {t('buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyCartPage
