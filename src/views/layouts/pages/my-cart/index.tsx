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
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import ItemCartProduct from './components/ItemCartProduct'
import { isFulfilled } from '@reduxjs/toolkit'

type TProps = {}

export const MyCartPage: NextPage<TProps> = () => {
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
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // memo
  const memoListAllProducts = useMemo(() => {
    return orderItems?.map((item: TItemOrderProduct) => item?.product?._id)
  }, [orderItems])

  const memoItemSelectedProduct = useMemo(() => {
    console.log('selected row', { selectedRows })
    const result: TItemOrderProduct[] = []

    selectedRows.forEach((idSelected: string) => {
      console.log('orderItems', { orderItems })
      const findItem: any = orderItems?.find((item: TItemOrderProduct) => item?.product?._id === idSelected)
      if (findItem) {
        result.push(findItem)
      }
    })

    return result
  }, [selectedRows, orderItems])

  const memoTotalSelectedProduct = useMemo(() => {
    console.log('memoItemSelectedProduct', memoItemSelectedProduct)
    const total = memoItemSelectedProduct?.reduce((result, current) => {
      const currentPrice = current?.discount > 0 ? (current.price * (100 - current?.discount)) / 100 : current?.price

      return result + currentPrice * current?.amount
    }, 0)

    return total
  }, [memoItemSelectedProduct])

  // handle

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

    const filteredItems = cloneOrderItems.filter(
      (item: TItemOrderProduct) => !selectedRows.includes(item?.product?._id)
    )

    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filteredItems })
    }
  }

  const handleNavigateCheckOut = () => {
    // only pass id and amount of the product to the router
    const formatData = JSON.stringify(
      memoItemSelectedProduct?.map(item => ({ product: item?.product?._id, amount: item?.amount }))
    )
    router.push({
      pathname: ROUTE_CONFIG.CHECKOUT_PRODUCT,
      query: {
        totalPrice: memoTotalSelectedProduct,
        productSelected: formatData
      }
    })
  }

  // side Effects
  useEffect(() => {
    const selectedProduct: any = router?.query?.selected
    if (selectedProduct) {
      if (typeof selectedProduct === 'string') {
        setSelectedRows([selectedProduct])
      } else {
        setSelectedRows([...selectedProduct])
      }
    }
  }, [router.query])

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
                  <ItemCartProduct
                    key={item?.product?._id}
                    item={item}
                    index={index}
                    selectedRows={selectedRows}
                    handleChangeCheckbox={handleChangeCheckbox}
                  />
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
            {formatNumberToLocal(memoTotalSelectedProduct)} VND
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={!selectedRows.length}
          sx={{ height: '40px', display: 'flex' }}
          onClick={handleNavigateCheckOut}
        >
          {t('buy_now')}
        </Button>
      </Box>
    </>
  )
}

export default MyCartPage
