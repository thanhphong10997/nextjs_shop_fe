// Import Mui
import { Box, Button, FormHelperText, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useMemo, useState } from 'react'

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

import Spinner from 'src/components/spinner'
import { createPaymentTypeAsync, updatePaymentTypeAsync } from 'src/stores/payment-type/actions'
import { getDetailsPaymentType } from 'src/services/payment-type'
import CustomSelect from 'src/components/custom-select'
import { PAYMENT_TYPES } from 'src/configs/payment'

type TCreateEditPaymentType = {
  open: boolean
  onClose: () => void
  paymentTypeId?: string
}

type TDefaultValues = {
  name: string
  type: string
}

const CreateEditPaymentType = (props: TCreateEditPaymentType) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  const ObjectPaymentType = PAYMENT_TYPES()

  // props
  const { open, onClose, paymentTypeId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    name: '',
    type: ''
  }
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field')),
      type: yup.string().required(t('required_field'))
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
      if (paymentTypeId) {
        // update
        dispatch(
          updatePaymentTypeAsync({
            id: paymentTypeId,
            name: data?.name,
            type: data?.type
          })
        )
      } else {
        dispatch(
          createPaymentTypeAsync({
            name: data?.name,
            type: data?.type
          })
        )
      }
    }
  }

  // fetch api

  const fetchDetailsPaymentType = async (id: string) => {
    setLoading(true)
    await getDetailsPaymentType(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name,
            type: data?.type
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
    } else if (paymentTypeId) {
      fetchDetailsPaymentType(paymentTypeId)
    }
  }, [open, paymentTypeId])

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
              {paymentTypeId ? t('edit_payment_type') : t('create_payment_type')}
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
                          label={t('payment_type_name')}
                          placeholder={t('enter_payment_type_name')}
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
                <Grid item md={12} xs={12}>
                  <Controller
                    name='type'
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Fixing error: Function components cannot be given refs

                      return (
                        <>
                          <CustomSelect
                            label={t('Type')}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            options={Object.values(ObjectPaymentType)}
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
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!paymentTypeId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditPaymentType
