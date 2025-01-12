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
import Switch, { SwitchProps } from '@mui/material/Switch'

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
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createProductAsync, updateProductAsync } from 'src/stores/product/actions'
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { convertFileToBase64, convertHTMLToDraft, stringToSlug } from 'src/utils'
import CustomSelect from 'src/components/custom-select'
import { getAllProductTypes } from 'src/services/product-type'
import CustomDatePicker from 'src/components/custom-date-picker'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import CustomEditor from 'src/components/custom-editor'
import { getDetailsProduct } from 'src/services/product'

type TCreateEditProduct = {
  open: boolean
  onClose: () => void
  productId?: string
}

type TDefaultValues = {
  name: string
  image: string
  type: string
  discount?: string
  price: string
  description: EditorState
  slug: string
  countInStock: string
  discountEndDate: Date | null
  discountStartDate: Date | null
  status: number
}

const CreateEditProduct = (props: TCreateEditProduct) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, productId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)
  const [productImage, setProductImage] = useState('')
  const [citiesOption, setOptionTypes] = useState<{ label: string; value: string }[]>([])

  // react hook form
  const defaultValues: TDefaultValues = {
    name: '',
    image: '',
    type: '',
    slug: '',
    discount: '',
    price: '',
    discountStartDate: null,
    discountEndDate: null,
    description: EditorState.createEmpty(),
    status: 0,
    countInStock: ''
  }
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field')),
      slug: yup.string().required(t('required_field')),
      type: yup.string().required(t('required_field')),
      price: yup
        .string()
        .required(t('required_field'))
        .test('least_count', t('least_1_in_count'), value => {
          return Number(value) >= 1000
        }),
      countInStock: yup
        .string()
        .required(t('required_field'))
        .test('least_count', t('least_1_in_count'), value => {
          return Number(value) >= 1
        }),
      discount: yup
        .string()
        .notRequired()
        .test('least_discount', t('least_1_in_discount'), (value, context: any) => {
          if (value) {
            const discountStartDate = context?.parent?.discountStartDate
            const discountEndDate = context?.parent?.discountEndDate
            if (!discountStartDate) {
              setError('discountStartDate', { type: 'require_start_discount', message: t('require_start_discount') })
            } else {
              clearErrors('discountStartDate')
            }
            if (!discountEndDate) {
              setError('discountEndDate', { type: 'require_end_discount', message: t('require_end_discount') })
            } else {
              clearErrors('discountEndDate')
            }
          } else {
            clearErrors(['discountStartDate', 'discountEndDate'])
          }

          return !value || Number(value) >= 1
        }),
      discountStartDate: yup
        .date()
        .notRequired()
        .test('require_start_discount', t('require_start_discount'), (value, context: any) => {
          const discount = context?.parent?.discount

          return (discount && value) || !discount
        })
        .test('less_end_date', t('less_end_date'), (value, context: any) => {
          const discountEndDate = context?.parent?.discountEndDate

          return (discountEndDate && value && discountEndDate?.getTime() > value?.getTime()) || !discountEndDate
        }),
      discountEndDate: yup
        .date()
        .notRequired()
        .test('require_end_discount', t('require_end_discount'), (value, context: any) => {
          const discountStartDate = context?.parent?.discountStartDate

          return (discountStartDate && value) || !discountStartDate
        })
        .test('more_start_date', t('more_start_date'), (value, context: any) => {
          const discountStartDate = context?.parent?.discountStartDate

          return (discountStartDate && value && discountStartDate?.getTime() < value?.getTime()) || !discountStartDate
        }),
      description: yup.object().required(t('required_field')),
      status: yup.number().required(t('required_field'))
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
      if (productId) {
        // update
        dispatch(
          updateProductAsync({
            id: productId,
            name: data?.name,
            slug: data?.slug,
            price: Number(data?.price),
            discount: Number(data?.discount) || 0,
            countInStock: Number(data?.countInStock),
            type: data?.type,
            discountStartDate: data?.discountStartDate,
            discountEndDate: data?.discountEndDate,
            description: data?.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            image: productImage,
            status: data?.status ? 1 : 0
          })
        )
      } else {
        dispatch(
          createProductAsync({
            name: data?.name,
            slug: data?.slug,
            price: Number(data?.price),
            discount: Number(data?.discount),
            countInStock: Number(data?.countInStock),
            type: data?.type,
            discountStartDate: data?.discountStartDate || null,
            discountEndDate: data?.discountEndDate || null,
            description: data?.description ? draftToHtml(convertToRaw(data.description.getCurrentContent())) : '',
            image: productImage,
            status: data?.status ? 1 : 0
          })
        )
      }
    }
  }

  const handleUploadProductImage = async (file: File) => {
    try {
      const convertBase64 = await convertFileToBase64(file)
      setProductImage(convertBase64 as string)
    } catch (err) {
      console.log('err', { err })

      return
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

  const fetchDetailsProduct = async (id: string) => {
    setLoading(true)
    await getDetailsProduct(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name,
            slug: data?.slug,
            price: data?.price,
            countInStock: data?.countInStock,
            discount: data?.discount || '',
            type: data?.type,
            discountStartDate: new Date(data?.discountStartDate) || null,
            discountEndDate: new Date(data?.discountEndDate) || null,
            description: data?.description ? convertHTMLToDraft(data.description) : '',
            status: data?.status
          })
          setProductImage(data?.productImage)
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
      setProductImage('')
    } else if (productId) {
      fetchDetailsProduct(productId)
    }
  }, [open, productId])

  useEffect(() => {
    fetchAllProductTypes()
  }, [])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {productId ? t('edit_product') : t('create_product')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container spacing={4}>
                {/* Left side */}
                <Grid container item md={6} xs={12}>
                  <Box sx={{ heigh: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative'
                            }}
                          >
                            {productImage ? (
                              <>
                                <IconButton
                                  sx={{
                                    position: 'absolute',
                                    bottom: -12,
                                    right: -12,
                                    zIndex: 2
                                  }}
                                  onClick={() => setProductImage('')}
                                >
                                  <Icon icon='fluent:delete-32-regular' />
                                </IconButton>
                                <Avatar src={productImage} sx={{ width: 100, height: 100 }} />
                              </>
                            ) : (
                              <>
                                <Avatar sx={{ width: 100, height: 100 }}>
                                  <Icon icon='ph:user-thin' fontSize={50} />
                                </Avatar>
                              </>
                            )}
                          </Box>

                          <WrapperFileUpload
                            uploadFunc={handleUploadProductImage}
                            acceptObjectFile={{
                              'image/jpeg': ['.jpeg', '.jpg'],
                              'image/png': ['.png']
                            }}
                          >
                            <Button
                              variant='outlined'
                              color='primary'
                              sx={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <Icon icon='mdi-light:camera' />
                              {productImage ? t('change_product_image') : t('upload_product_image')}
                            </Button>
                          </WrapperFileUpload>
                        </Box>
                      </Grid>

                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='name'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                label={t('product_type_name')}
                                placeholder={t('enter_product_type_name')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                                onBlur={onBlur}
                                onChange={e => {
                                  const value = e.target.value
                                  const replaceString = stringToSlug(value)
                                  onChange(value)
                                  reset({
                                    ...getValues(),
                                    slug: replaceString
                                  })
                                }}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='slug'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                disabled
                                label={t('Slug')}
                                placeholder={t('enter_slug')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors?.slug)}
                                helperText={errors?.slug?.message}
                                onChange={onChange}
                                onBlur={onBlur}
                              />
                            )
                          }}
                        />
                      </Grid>

                      <Grid item md={6} xs={12}>
                        <Controller
                          name='status'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InputLabel>{t('product_status')}</InputLabel>
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
                                  label={Boolean(value) ? t('public') : t('private')}
                                />
                              </Box>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Right side */}
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={5}>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='price'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                label={t('price')}
                                placeholder={t('enter_price')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors.price)}
                                helperText={errors?.price?.message}
                                onBlur={onBlur}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='countInStock'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                label={t('count_in_stock')}
                                placeholder={t('enter_your_count')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors.countInStock)}
                                helperText={errors?.countInStock?.message}
                                onBlur={onBlur}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='type'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <>
                                <CustomSelect
                                  label={t('Type_product')}
                                  value={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  options={citiesOption}
                                  error={Boolean(errors?.type)}
                                  placeholder={t('Select')}
                                  fullWidth
                                />
                                {errors?.type?.message && (
                                  <FormHelperText
                                    sx={{
                                      color: theme.palette.error.main,
                                      position: 'absolute'
                                    }}
                                  >
                                    {errors.type.message}
                                  </FormHelperText>
                                )}
                              </>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='discount'
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                label={t('discount(percent)')}
                                placeholder={t('enter_discount')}
                                variant='filled'
                                value={value}
                                fullWidth
                                error={Boolean(errors?.discount)}
                                helperText={errors?.discount?.message}
                                inputProps={{
                                  inputMode: 'numeric',
                                  pattern: '[0-9]*',
                                  minLength: 1
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
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='discountStartDate'
                          rules={{ required: true }}
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <CustomDatePicker
                                required
                                minDate={new Date()}
                                placeholder={t('select_start_date')}
                                selectedDate={value}
                                error={Boolean(errors?.discountStartDate)}
                                helperText={errors?.discountStartDate?.message}
                                onBlur={onBlur}
                                onChange={(date: Date | null) => {
                                  onChange(date)
                                }}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='discountEndDate'
                          rules={{ required: true }}
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <CustomDatePicker
                                required
                                placeholder={t('select_end_date')}
                                selectedDate={value}
                                error={Boolean(errors?.discountEndDate)}
                                helperText={errors?.discountEndDate?.message}
                                onBlur={onBlur}
                                onChange={(date: Date | null) => {
                                  onChange(date)
                                }}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          name='description'
                          rules={{ required: true }}
                          control={control}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <CustomEditor
                                placeholder={t('enter_your_description')}
                                editorState={value as EditorState}
                                error={Boolean(errors?.description)}
                                helperText={errors?.description?.message}
                                onBlur={onBlur}
                                onEditorStateChange={onChange}
                              />
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
                {!productId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditProduct
