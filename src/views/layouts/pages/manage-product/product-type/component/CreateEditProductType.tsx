// Import Mui
import { Box, Button, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material'

// Import React
import React, { memo, useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createProductTypeAsync, updateProductTypeAsync } from 'src/stores/product-type/actions'

// services
import { createProductType, getDetailsProductType, updateProductType } from 'src/services/product-type'

// components
import Spinner from 'src/components/spinner'

// Utils
import { stringToSlug } from 'src/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/configs/queryKey'
import toast from 'react-hot-toast'

type TCreateEditProductType = {
  open: boolean
  onClose: () => void
  productTypeId?: string
  page?: number
  pageSize?: number
  sortBy?: string
  searchBy?: string
}

type TDefaultValues = {
  name: string
  slug: string
}

const CreateEditProductType = (props: TCreateEditProductType) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // react query
  const queryClient = useQueryClient()

  // props
  const { open, onClose, productTypeId, page, pageSize, sortBy, searchBy } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    name: '',
    slug: ''
  }
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field')),
      slug: yup.string().required(t('required_field'))
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // handle
  const onSubmit = (data: TDefaultValues) => {
    if (!Object.keys(errors)?.length) {
      if (productTypeId) {
        // update
        // dispatch(
        //   updateProductTypeAsync({
        //     id: productTypeId,
        //     name: data?.name,
        //     slug: data?.slug
        //   })
        // )
        mutateUpdate({
          id: productTypeId,
          name: data?.name,
          slug: data?.slug
        })
      } else {
        // dispatch(
        //   createProductTypeAsync({
        //     name: data?.name,
        //     slug: data?.slug
        //   })
        // )
        mutateCreate({
          name: data?.name,
          slug: data?.slug
        })
      }
    }
  }

  // fetch api

  const fetchDetailsDeliveryType = async (id: string) => {
    setLoading(true)
    await getDetailsProductType(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name,
            slug: data?.slug
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  // react query
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationKey: [queryKeys.create_product_type],
    mutationFn: createProductType,
    onSuccess: () => {
      toast.success(t('create_product_type_success'))
      onClose()
      queryClient.invalidateQueries({ queryKey: [queryKeys.get_all_product_types, pageSize, page, searchBy, sortBy] })
    },
    onError: err => {
      toast.error(t('create_product_type_error'))
    }
  })

  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationKey: [queryKeys.update_product_type],
    mutationFn: updateProductType,
    onSuccess: () => {
      toast.success(t('update_product_type_success'))
      onClose()
      queryClient.refetchQueries({ queryKey: [queryKeys.get_all_product_types, pageSize, page, searchBy, sortBy] })
    },
    onError: err => {
      toast.error(t('update_product_type_error'))
    }
  })

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
    } else if (productTypeId) {
      fetchDetailsDeliveryType(productTypeId)
    }
  }, [open, productTypeId])

  return (
    <>
      {(loading || isCreating || isUpdating) && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '500px', xs: '80vw' }}
          maxWidth={{ md: '50vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {productTypeId ? t('edit_product_type') : t('create_product_type')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container item md={12} xs={12}>
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
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!productTypeId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default memo(CreateEditProductType)
