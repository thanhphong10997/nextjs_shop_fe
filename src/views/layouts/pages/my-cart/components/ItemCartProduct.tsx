// Mui
import { Avatar, Box, Checkbox, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material'

// react
import { Fragment, useEffect, useState } from 'react'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateProductToCart } from 'src/stores/order-product'

// others
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { getLocalProductCart, setLocalProductToCart } from 'src/helpers/storage'
import { useAuth } from 'src/hooks/useAuth'
import { getDetailsProductPublic } from 'src/services/product'
import { TItemOrderProduct } from 'src/types/order-product'
import { cloneDeep, convertUpdateProductToCart, formatNumberToLocal, isExpiry } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {
  item: TItemOrderProduct
  index: number
  selectedRows: string[]
  handleChangeCheckbox: (value: string) => void
}

const ItemCartProduct = ({ item, index, selectedRows, handleChangeCheckbox }: TProps) => {
  // theme
  const theme = useTheme()

  // hooks
  const { user } = useAuth()

  // redux
  const { orderItems } = useSelector((state: RootState) => state.orderProduct)
  const dispatch: AppDispatch = useDispatch()

  // react
  const [itemState, setItemState] = useState<TItemOrderProduct>(item)

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
      product: item?.product
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
    const filteredItems = cloneOrderItems.filter((item: TItemOrderProduct) => item?.product?._id !== id)
    if (user) {
      dispatch(
        updateProductToCart({
          orderItems: filteredItems
        })
      )
      setLocalProductToCart({ ...parseData, [user?._id]: filteredItems })
    }
  }

  // fetch api
  const fetchDetailsProduct = async (id: string) => {
    const res = await getDetailsProductPublic(id)
    const data = res?.data

    if (data) {
      const discountItem = isExpiry(data?.discountStartDate, data?.discountEndDate) ? data?.discount : 0
      setItemState({
        name: data?.name,
        amount: item.amount,
        image: data?.image,
        price: data?.price,
        discount: discountItem,
        product: {
          _id: data?._id,
          slug: data?.slug,
          countInStock: data?.countInStock
        }
      })
    }
  }

  useEffect(() => {
    if (item?.product?._id) {
      fetchDetailsProduct(item?.product?._id)
    }
  }, [item?.product?._id])

  useEffect(() => {
    setItemState(prev => ({ ...prev, amount: item?.amount }))
  }, [item?.amount])

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', mt: '16px' }}>
        <Box sx={{ width: '5%' }}>
          <Checkbox
            disabled={!itemState?.product?.countInStock}
            checked={selectedRows.includes(itemState?.product?._id)}
            value={itemState?.product?._id}
            onChange={e => {
              handleChangeCheckbox(e.target.value)
            }}
          />
        </Box>
        <Avatar sx={{ width: '100px', height: '100px', borderRadius: 0 }} src={itemState?.image} />
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
          <Link
            style={{ textDecoration: 'none', color: theme.palette.primary.main }}
            href={`/product/${itemState?.product?.slug}`}
          >
            {itemState?.name}
          </Link>
        </Typography>
        <Box sx={{ flexBasis: '20%' }}>
          <Typography
            variant='h6'
            mt={2}
            sx={{
              color: itemState?.discount ? theme.palette.error.main : theme.palette.primary.main,
              fontWeight: 'bold',
              textDecoration: itemState?.discount ? 'line-through' : 'normal',
              fontSize: '18px'
            }}
          >
            {formatNumberToLocal(itemState?.price)} VND
          </Typography>
        </Box>
        <Box sx={{ flexBasis: '20%', display: 'flex', alignItems: 'center', gap: 1 }}>
          {item.discount > 0 && (
            <Typography
              variant='h4'
              mt={2}
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '18px' }}
            >
              {formatNumberToLocal((itemState?.price * (100 - item.discount)) / 100)} VND
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
                - {itemState?.discount}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ flexBasis: '10%', mt: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton
            disabled={!itemState?.product?.countInStock}
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
            disabled={!itemState?.product?.countInStock}
            type='number'
            value={itemState?.amount}
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
            disabled={!itemState?.product?.countInStock}
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
          <IconButton onClick={() => handleDeleteProductCart(itemState?.product?._id)}>
            <Icon icon='ic:outline-delete' />
          </IconButton>
        </Box>
      </Box>
      {index !== orderItems.length - 1 && <Divider />}
    </Fragment>
  )
}

export default ItemCartProduct
