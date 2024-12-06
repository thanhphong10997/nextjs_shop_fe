'use client'

// Import Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// Import components
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import CustomTextField from 'src/components/text-field'

// Import Images
import RegisterLight from '/public/images/register-light.png'
import RegisterDark from '/public/images/register-dark.png'

// Import Mui
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  useTheme,
  Card,
  Avatar
} from '@mui/material'
import { makeStyles } from '@mui/styles'

// Import react hook form
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Import yup
import * as yup from 'yup'

// Import React
import React, { useEffect, useState } from 'react'

// Import icons
import IconifyIcon from 'src/components/Icon'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react/dist/iconify.js'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}
type Inputs = {
  email: string
  role: string
  fullName: string
  city: string
  address: string
  phoneNumber: string
}

const useStyles = makeStyles((theme: any) => {
  return {
    paper: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: '4px',
      backgroundColor: '#333'
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: '4px'
    },
    submit: {
      margin: '8px'
    }
  }
})

export const MyProfilePage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()
  const { t } = useTranslation()
  const { user } = useAuth()
  const handleUploadAvatar = (file: File) => {}

  const schema = yup
    .object()
    .shape({
      email: yup.string().required('The field is required').matches(EMAIL_REG, 'Please enter a valid email address!'),
      fullName: yup.string().required('The field is required'),
      city: yup.string().required('The field is required'),
      address: yup.string().required('The field is required'),
      role: yup.string().required('The field is required'),
      phoneNumber: yup.string().required('The field is required')
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      phoneNumber: '',
      role: '',
      city: '',
      address: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data)

  useEffect(() => {
    console.log('user', user)
    if (user) {
      reset({
        email: '',
        phoneNumber: '',
        city: '',
        address: '',
        role: user?.role?.name
      })
    }
  }, [user])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container>
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}
        >
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
                  <Avatar sx={{ width: 100, height: 100 }}>
                    <Icon icon='ph:user-thin' fontSize={50} />
                  </Avatar>
                  <WrapperFileUpload
                    uploadFunc={handleUploadAvatar}
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
                      {t('upload_avatar')}
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        required
                        label={t('Email')}
                        error={Boolean(errors.email)}
                        placeholder={t('enter_your_email')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.email?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name='role'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        disabled
                        required
                        label={t('Role')}
                        error={Boolean(errors.role)}
                        placeholder={t('enter_your_role')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.role?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Right side */}
        <Grid container item md={6} xs={12}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: '20px',
              px: 4
            }}
            marginLeft={{ md: 5, xs: 0 }}
            marginTop={{ md: 0, xs: 5 }}
          >
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  name='fullName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        required
                        label={t('Full_name')}
                        error={Boolean(errors.fullName)}
                        placeholder={t('enter_your_full_name')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.fullName?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        required
                        label={t('Address')}
                        error={Boolean(errors.address)}
                        placeholder={t('enter_your_address')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.address?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name='city'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        required
                        label={t('City')}
                        error={Boolean(errors.city)}
                        placeholder={t('enter_your_city')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.city?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  name='phoneNumber'
                  control={control}
                  render={({ field }) => {
                    // Fixing error: Function components cannot be given refs
                    const { ref, ...rests } = field

                    return (
                      <CustomTextField
                        required
                        label={t('Phone_number')}
                        error={Boolean(errors.phoneNumber)}
                        placeholder={t('enter_your_phone')}
                        variant='filled'
                        fullWidth
                        autoFocus
                        helperText={errors?.phoneNumber?.message}
                        {...rests}
                      />
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
        <Button type='submit' variant='contained' color='primary' sx={{ margin: '12px 0' }}>
          {t('update')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
