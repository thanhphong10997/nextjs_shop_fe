'use client'

// Import Next
import { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// Import components
import { EMAIL_REG } from 'src/configs/regex'

// Import Images
import ForgotPasswordLight from '/public/images/forgot-password-light.png'
import ForgotPasswordDark from '/public/images/forgot-password-dark.png'

// Import Mui
import { Box, Button, Grid, IconButton, InputAdornment, TextField, Typography, useTheme } from '@mui/material'

// Import react hook form
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Import yup
import * as yup from 'yup'

// Import React
import React, { useEffect, useState } from 'react'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

// Hooks
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import FallbackSpinner from 'src/components/fall-back'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useRouter } from 'next/router'
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPasswordAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'
import Spinner from 'src/components/spinner'

type TProps = {}
type Inputs = {
  email: string
}

export const ForgotPasswordPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t } = useTranslation()

  // router
  const router = useRouter()

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessForgotPassword, isErrorForgotPassword, messageForgotPassword, typeError } = useSelector(
    (state: RootState) => state.auth
  )

  // yup form
  const schema = yup
    .object()
    .shape({
      email: yup.string().required(t('required_field')).matches(EMAIL_REG, t('rules_email'))
    })
    .required()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      email: 'admin@gmail.com'
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    if (!Object.keys(errors)?.length) {
      dispatch(forgotPasswordAuthAsync({ email: data?.email }))
    }
  }

  // handle

  // side effects
  useEffect(() => {
    // condition to make the toast message does not show in the first time the page loads because the default value of 'isSuccessForgotPassword' is true
    if (messageForgotPassword) {
      if (isSuccessForgotPassword) {
        toast.success(t('forgot_password_success'))
        dispatch(resetInitialState())
      } else if (isErrorForgotPassword && messageForgotPassword) {
        toast.error(t('forgot_password_error'))
        dispatch(resetInitialState())
      }
    }
  }, [isSuccessForgotPassword, isErrorForgotPassword, messageForgotPassword])

  return (
    <>
      {isLoading && <Spinner />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: theme.palette.background.paper,
          padding: '40px'
        }}
      >
        <Box
          display={{
            md: 'flex',
            xs: 'none'
          }}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            backgroundColor: theme.palette.customColors.bodyBg,
            height: '100%',
            minWidth: '50vw'
          }}
        >
          <Image
            src={theme.palette.mode === 'light' ? ForgotPasswordLight : ForgotPasswordDark}
            alt='Forgot-password image'
            style={{
              width: 'auto',
              height: '100%'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}
        >
          <Typography component='h1' variant='h5'>
            {t('forgot_password')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ mt: 2 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.email)}
                      placeholder={t('enter_your_email')}
                      variant='outlined'
                      fullWidth
                      helperText={errors?.email?.message}
                      value={value}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end'>
                              <Icon icon='dashicons:email-alt' />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>

            <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 4 }}>
              {t('send_request')}
            </Button>
            <Button
              startIcon={<Icon icon='uiw:left' />}
              type='submit'
              fullWidth
              variant='outlined'
              color='primary'
              sx={{ mt: 4 }}
              onClick={() => router.push(ROUTE_CONFIG.LOGIN)}
            >
              {t('back_login')}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default ForgotPasswordPage
