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

type TProps = {
  dataOrder: TItemOrderProductMe
}

export const OrderCard: NextPage<TProps> = props => {
  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // translate
  const { t, i18n } = useTranslation()

  // router
  const router = useRouter()

  // props
  const { dataOrder } = props

  // react

  // handle

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
        <Divider />
        <Box mt={4} mb={4} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {dataOrder?.orderItems?.map((item: TItemOrderProduct) => {
            return (
              <Box key={item.product} sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
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
          <Button type='submit' variant='contained' color='primary' sx={{ height: '40px', display: 'flex' }}>
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
