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
import { convertFileToBase64, convertFullName, toFullName } from 'src/utils'
import { createCityAsync, updateCityAsync } from 'src/stores/city/actions'
import { getDetailsCity } from 'src/services/city'

type TCreateEditCity = {
  open: boolean
  onClose: () => void
  cityId?: string
}

type TDefaultValues = {
  name: string
}

const CreateEditCity = (props: TCreateEditCity) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, cityId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    name: ''
  }
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field'))
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
      if (cityId) {
        // update
        dispatch(
          updateCityAsync({
            id: cityId,
            name: data?.name
          })
        )
      } else {
        dispatch(
          createCityAsync({
            name: data?.name
          })
        )
      }
    }
  }

  // fetch api

  const fetchDetailsCity = async (id: string) => {
    setLoading(true)
    await getDetailsCity(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data?.name
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
    } else if (cityId) {
      fetchDetailsCity(cityId)
    }
  }, [open, cityId])

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
              {cityId ? t('edit_city') : t('create_city')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container item md={12} xs={12}>
                <Grid item md={12} xs={12}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => {
                      // Fixing error: Function components cannot be given refs

                      return (
                        <TextField
                          required
                          label={t('Name_city')}
                          placeholder={t('enter_name')}
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
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!cityId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default memo(CreateEditCity)
