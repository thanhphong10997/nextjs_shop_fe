// Import Mui
import { Box, Button, FormHelperText, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material'

// Import React
import { memo, useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import { Controller, useForm } from 'react-hook-form'
import CustomModal from 'src/components/custom-modal'

// hook form
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// redux
import { useDispatch } from 'react-redux'
import { getDetailsOrderProduct } from 'src/services/order-product'
import { AppDispatch } from 'src/stores'
import { updateOrderProductAsync } from 'src/stores/order-product/actions'

// components
import CustomSelect from 'src/components/custom-select'
import Spinner from 'src/components/spinner'

// others
import { getAllCities } from 'src/services/city'
import { stringToSlug } from 'src/utils'

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
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])

  // react hook form
  const defaultValues: TDefaultValues = {
    fullName: '',
    phone: '',
    address: '',
    city: ''
  }
  const schema = yup
    .object()
    .shape({
      fullName: yup.string().required(t('required_field')),
      phone: yup.string().required(t('required_field')),
      address: yup.string().required(t('required_field')),
      city: yup.string().required(t('required_field'))
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
            address: data?.shippingAddress?.address
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
    if (open) fetchAllCities()
  }, [open])

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
                                label={t('phone_number')}
                                placeholder={t('enter_phone')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.phone)}
                                helperText={errors?.phone?.message}
                                inputProps={{
                                  inputMode: 'numeric',
                                  pattern: '[0-9]*',
                                  minLength: 8
                                }}
                                onBlur={onBlur}
                                onChange={e => {
                                  // replace all of characters into empty string, only accept numbers
                                  const numberValue = e.target.value.replace(/\D/g, '')
                                  onChange(numberValue)
                                }}
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

export default memo(EditOrderProduct)
