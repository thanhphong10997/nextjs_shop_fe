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
import { TItemOrderProduct, TItemOrderProductMe } from 'src/types/order-product'
import { updateProductToCart } from 'src/stores/order-product'

// helpers
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import NoData from 'src/components/no-data'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { getAllOrderProductsByMeAsync } from 'src/stores/order-product/actions'
import OrderCard from './components/OrderCard'

type TProps = {}

export const MyOrderPage: NextPage<TProps> = () => {
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

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])

  // redux
  const { ordersOfMe } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // handle

  // fetch API
  const handleGetListOrdersOfMe = () => {
    const query = {
      params: { limit: pageSize, page: page }
    }
    dispatch(getAllOrderProductsByMeAsync(query))
  }

  // side Effects

  useEffect(() => {
    handleGetListOrdersOfMe()
  }, [page, pageSize])

  return (
    <>
      {/* {(isLoading || loading) && <Spinner />} */}
      <Box>
        {ordersOfMe?.data?.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px', margin: '1rem 0' }}>
            {ordersOfMe?.data?.map((item: TItemOrderProductMe, index: number) => {
              return <OrderCard key={item?._id} dataOrder={item} />
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', padding: '20px' }}>
            {' '}
            <NoData widthImage='100px' heightImage='100px' textNodata={t('no_product')} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default MyOrderPage
