'use client'

// Import Next
import { NextPage } from 'next'
import Image from 'next/image'

// Import components
import Spinner from 'src/components/spinner'

// Import Mui
import { Box, Button, Grid, useTheme, Typography, Rating, IconButton, TextField } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// utils
import { convertUpdateProductToCart, formatNumberToLocal } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

// router
import { useRouter } from 'next/router'

// types
import { TProduct } from 'src/types/product'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { getDetailsProductPublicBySlug } from 'src/services/product'
import { updateProductToCart } from 'src/stores/order-product'

// icon
import { Icon } from '@iconify/react/dist/iconify.js'

// helpers
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'

// auth
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

export const DetailsProductPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [loading, setLoading] = useState(false)
  const [dataProduct, setDataProduct] = useState<TProduct | any>({})
  const [amountProduct, setAmountProduct] = useState(1)

  // router
  const router = useRouter()
  const productId = router.query?.productId as string

  // auth
  const { user } = useAuth()

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // fetch api
  const fetchGetDetailsProduct = async (slug: string) => {
    setLoading(true)
    await getDetailsProductPublicBySlug(slug)
      .then(async res => {
        const data = res?.data
        if (data) {
          setDataProduct(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // handle
  const handleUpdateProductToCart = (item: TProduct) => {
    const productCart = getLocalProductCart()
    const parseData = productCart ? JSON.parse(productCart) : {}
    const listOrderItems = convertUpdateProductToCart(orderItems, {
      name: item?.name,
      amount: amountProduct,
      image: item?.image,
      price: item?.price,
      discount: item?.discount,
      product: item?._id,
      slug: item?.slug
    })

    if (user?._id) {
      dispatch(
        updateProductToCart({
          orderItems: listOrderItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: listOrderItems })
    } else {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }

  useEffect(() => {
    if (productId) fetchGetDetailsProduct(productId)
  }, [productId])

  return (
    <>
      {loading && <Spinner />}
      <Grid container>
        {/* Left side */}
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}
        >
          <Box sx={{ heigh: '100%', width: '100%' }}>
            <Grid container spacing={8}>
              <Grid item md={5} xs={12}>
                <Image
                  src={dataProduct?.image}
                  width={0}
                  height={0}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '15px' }}
                  alt='banner'
                />
              </Grid>
              <Grid item md={7} xs={12}>
                <Box>
                  <Typography
                    variant='h3'
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {dataProduct?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  {dataProduct.averageRating > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant='h3'
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        {dataProduct?.averageRating}
                      </Typography>
                      <Rating
                        sx={{ fontSize: '16px' }}
                        name='read-only'
                        defaultValue={dataProduct?.averageRating}
                        precision={0.5}
                        readOnly
                      />
                    </Box>
                  )}
                  <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                    {!!dataProduct.totalReview ? (
                      <span>
                        {t('Review')}
                        <b>{dataProduct.totalReview}</b>
                      </span>
                    ) : (
                      <span>{t('not_review')}</span>
                    )}
                  </Typography>
                  {dataProduct.sold > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        {t('sold_product', { count: dataProduct.sold })}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    backgroundColor: theme.palette.customColors.bodyBg,
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  {dataProduct.discount > 0 && (
                    <Typography
                      variant='h6'
                      sx={{
                        color: theme.palette.error.main,
                        fontWeight: 'bold',
                        textDecoration: 'line-through',
                        fontSize: '18px'
                      }}
                    >
                      {formatNumberToLocal(dataProduct?.price)} VND
                    </Typography>
                  )}
                  <Typography
                    variant='h4'
                    sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '24px' }}
                  >
                    {formatNumberToLocal((dataProduct?.price * (100 - dataProduct.discount)) / 100)} VND
                  </Typography>
                  {dataProduct.discount > 0 && (
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
                        - {dataProduct?.discount}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ flexBasis: '10%', mt: 8, display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}`,
                      color: `${theme.palette.common.white}`,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                    }}
                    onClick={() => {
                      if (amountProduct > 1) {
                        setAmountProduct(prev => prev - 1)
                      }
                    }}
                  >
                    <Icon icon='lucide:minus' fontSize={12} />
                  </IconButton>
                  <TextField
                    type='number'
                    value={amountProduct}
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
                      min: 1,
                      max: dataProduct?.countInStock
                    }}
                    onChange={e => {
                      // replace all of characters into empty string, only accept numbers
                      setAmountProduct(+e.target.value)
                    }}
                  />
                  <IconButton
                    sx={{
                      backgroundColor: `${theme.palette.primary.main}`,
                      color: `${theme.palette.common.white}`,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}!important` }
                    }}
                    onClick={() => {
                      if (amountProduct < dataProduct.countInStock) {
                        setAmountProduct(prev => prev + 1)
                      }
                    }}
                  >
                    <Icon icon='meteor-icons:plus' fontSize={12} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingBottom: '10px',
                    gap: 6,
                    mt: 8
                  }}
                >
                  <Button
                    type='submit'
                    variant='outlined'
                    color='primary'
                    sx={{ height: '40px', display: 'flex' }}
                    onClick={() => handleUpdateProductToCart(dataProduct)}
                  >
                    {t('add_to_cart')}
                  </Button>
                  <Button type='submit' variant='contained' color='primary' sx={{ height: '40px', display: 'flex' }}>
                    {t('buy_now')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid
          container
          item
          md={12}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4, mt: 6 }}
        >
          <Box sx={{ heigh: '100%', width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 2,
                backgroundColor: theme.palette.customColors.bodyBg,
                padding: '8px',
                borderRadius: '8px'
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: `${theme.palette.customColors.main}ad`,
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}
              >
                {t('product_description')}
              </Typography>
            </Box>
            <Box dangerouslySetInnerHTML={{ __html: dataProduct?.description }} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailsProductPage
