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
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'

import Spinner from 'src/components/spinner'
import { createDeliveryTypeAsync, updateDeliveryTypeAsync } from 'src/stores/delivery-type/actions'
import { getDetailsDeliveryType } from 'src/services/delivery-type'

type TCreateEditDeliveryType = {
  open: boolean
  onClose: () => void
  deliveryTypeId?: string
}

type TDefaultValues = {
  name: string
  price: string
}

const CreateEditDeliveryType = (props: TCreateEditDeliveryType) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, deliveryTypeId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    name: '',
    price: ''
  }
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field')),
      price: yup
        .string()
        .required(t('required_field'))
        .test('least_value_price', t('least_1000_in_price'), value => {
          return Number(value) >= 1000
        })
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // handle
  const onSubmit = (data: TDefaultValues) => {
    if (!Object.keys(errors)?.length) {
      if (deliveryTypeId) {
        // update
        dispatch(
          updateDeliveryTypeAsync({
            id: deliveryTypeId,
            name: data?.name,
            price: data?.price
          })
        )
      } else {
        dispatch(
          createDeliveryTypeAsync({
            name: data?.name,
            price: data?.price
          })
        )
      }
    }
  }

  // fetch api

  const fetchDetailsDeliveryType = async (id: string) => {
    setLoading(true)
    await getDetailsDeliveryType(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name,
            price: data?.price
          })
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
    } else if (deliveryTypeId) {
      fetchDetailsDeliveryType(deliveryTypeId)
    }
  }, [open, deliveryTypeId])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '500px', xs: '80vw' }}
          maxWidth={{ md: '50vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {deliveryTypeId ? t('edit_delivery_type') : t('create_delivery_type')}
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
                          label={t('delivery_type_name')}
                          placeholder={t('enter_delivery_type_name')}
                          variant='filled'
                          fullWidth
                          value={value}
                          error={Boolean(errors?.name)}
                          helperText={errors?.name?.message}
                          onBlur={onBlur}
                          onChange={onChange}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid item md={12} xs={12} mb={2}>
                  <Controller
                    name='price'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Fixing error: Function components cannot be given refs

                      return (
                        <TextField
                          required
                          label={t('delivery_type_price')}
                          placeholder={t('enter_delivery_type_price')}
                          variant='filled'
                          fullWidth
                          value={value}
                          error={Boolean(errors?.price)}
                          helperText={errors?.price?.message}
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*'
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
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!deliveryTypeId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default memo(CreateEditDeliveryType)
