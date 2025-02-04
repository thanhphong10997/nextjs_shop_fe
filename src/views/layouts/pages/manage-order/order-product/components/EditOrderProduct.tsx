// Import Mui
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createProductAsync, updateProductAsync } from 'src/stores/product/actions'

// components
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import CustomSelect from 'src/components/custom-select'
import CustomDatePicker from 'src/components/custom-date-picker'
import CustomEditor from 'src/components/custom-editor'

// others
import { convertFileToBase64, convertHTMLToDraft, stringToSlug } from 'src/utils'
import { getAllProductTypes } from 'src/services/product-type'
import { getDetailsProduct } from 'src/services/product'
import { getAllCities } from 'src/services/city'

// draftJs
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { getDetailsOrderProduct } from 'src/services/order-product'
import { updateOrderProductAsync } from 'src/stores/order-product/actions'

type TEditProduct = {
  open: boolean
  onClose: () => void
  orderId?: string
}

type TDefaultValues = {
  fullName: string
  phone: string
  address: string
  city: string
  isPaid: number
  isDelivered: number
}

const EditOrderProduct = (props: TEditProduct) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, orderId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)
  const [productImage, setProductImage] = useState('')
  const [typesOption, setOptionTypes] = useState<{ label: string; value: string }[]>([])
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])

  // react hook form
  const defaultValues: TDefaultValues = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    isPaid: 0,
    isDelivered: 0
  }
  const schema = yup
    .object()
    .shape({
      fullName: yup.string().required(t('required_field')),
      phone: yup.string().required(t('required_field')),
      address: yup.string().required(t('required_field')),
      city: yup.string().required(t('required_field')),

      isPaid: yup.number().required(t('required_field')),
      isDelivered: yup.number().required(t('required_field'))
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // handle
  const onSubmit = (data: any) => {
    if (!Object.keys(errors)?.length) {
      console.log('data', { data })
      if (orderId) {
        // update
        dispatch(
          updateOrderProductAsync({
            id: orderId,
            shippingAddress: {
              fullName: data?.fullName,
              phone: data?.phone,
              city: data?.city,
              address: data?.address
            },
            isDelivered: data?.isDelivered,
            isPaid: data?.isPaid
          })
        )
      }
    }
  }

  // fetch api

  const fetchAllProductTypes = async () => {
    await getAllProductTypes({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.productTypes
        if (data) {
          setOptionTypes(
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

  const fetchDetailsOrderProduct = async (id: string) => {
    setLoading(true)
    await getDetailsOrderProduct(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            fullName: data?.shippingAddress?.fullName,
            phone: data?.shippingAddress?.phone,
            city: data?.shippingAddress?.city,
            address: data?.shippingAddress?.address,
            isPaid: data?.isPaid ? 1 : 0,
            isDelivered: data?.isDelivered ? 1 : 0
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

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

  // side effects
  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
      setProductImage('')
    } else if (orderId) {
      fetchDetailsOrderProduct(orderId)
    }
  }, [open, orderId])

  useEffect(() => {
    fetchAllProductTypes()
    fetchAllCities()
  }, [])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '40vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {t('edit_order_product')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container spacing={4}>
                {/* Left side */}
                <Grid container item md={12} xs={12}>
                  <Box sx={{ heigh: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='fullName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                label={t('user_name')}
                                placeholder={t('enter_user_name')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.fullName)}
                                helperText={errors?.fullName?.message}
                                onBlur={onBlur}
                                onChange={e => {
                                  const value = e.target.value
                                  const replaceString = stringToSlug(value)
                                  onChange(value)
                                }}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='address'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                disabled
                                label={t('address')}
                                placeholder={t('enter_address')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.address)}
                                helperText={errors?.address?.message}
                                onChange={onChange}
                                onBlur={onBlur}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='phone'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                disabled
                                label={t('phone_number')}
                                placeholder={t('enter_phone')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.phone)}
                                helperText={errors?.phone?.message}
                                onChange={onChange}
                                onBlur={onBlur}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          name='city'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <>
                                <CustomSelect
                                  label={t('city')}
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  options={citiesOption}
                                  error={Boolean(errors?.city)}
                                  placeholder={t('Select')}
                                  fullWidth
                                />
                                {errors?.city?.message && (
                                  <FormHelperText
                                    sx={{
                                      color: theme.palette.error.main,
                                      position: 'absolute'
                                    }}
                                  >
                                    {errors?.city?.message}
                                  </FormHelperText>
                                )}
                              </>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          name='isDelivered'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    fontSize: '14px',
                                    display: 'block',
                                    color: `${theme.palette.customColors.main}ad`
                                  }}
                                >
                                  {t('delivery_status')}
                                </InputLabel>
                                <FormControlLabel
                                  sx={{
                                    margin: 0
                                  }}
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={event => {
                                        onChange(event?.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('delivered') : t('not_delivered')}
                                />
                              </Box>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='isPaid'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}
                              >
                                <InputLabel
                                  sx={{
                                    fontSize: '14px',
                                    display: 'block',
                                    color: `${theme.palette.customColors.main}ad`
                                  }}
                                >
                                  {t('payment_status')}
                                </InputLabel>
                                <FormControlLabel
                                  sx={{
                                    margin: 0
                                  }}
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={event => {
                                        onChange(event?.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('paid') : t('not_paid')}
                                />
                              </Box>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!orderId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default EditOrderProduct
