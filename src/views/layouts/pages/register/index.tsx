'use client'

// Import Next
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// Import components
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// Import Images
import RegisterLight from '/public/images/register-light.png'
import RegisterDark from '/public/images/register-dark.png'

// Import Mui
import { Box, Button, TextField, Grid, Typography, InputAdornment, IconButton, useTheme } from '@mui/material'
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
import { useDispatch, useSelector } from 'react-redux'
import { registerAuthAsync, registerAuthFacebookAsync, registerAuthGoogleAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { signIn, useSession } from 'next-auth/react'
import { clearLocalPreTokenSocial, getLocalPreTokenSocial, setLocalPreTokenSocial } from 'src/helpers/storage'

type TProps = {}
type Inputs = {
  email: string
  password: string
  confirmPassword: string
}

export const RegisterPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // router
  const router = useRouter()

  // translate
  const { t } = useTranslation()

  // auth
  const { data: session } = useSession()

  // local storage
  const prevLocalSocialToken = getLocalPreTokenSocial()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth)

  // react hook form
  const schema = yup
    .object()
    .shape({
      email: yup.string().required(t('required_field')).matches(EMAIL_REG, t('rules_email')),
      password: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
      confirmPassword: yup
        .string()
        .required(t('required_field'))
        .matches(PASSWORD_REG, t('rules_password'))
        .oneOf([yup.ref('password'), ''], t('rules_confirm_password'))
    })
    .required()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    const { email, password } = data
    dispatch(registerAuthAsync({ email, password }))
  }

  // handle
  const handleSignupGoogle = () => {
    signIn('google')
    clearLocalPreTokenSocial()
  }

  const handleSignupFacebook = () => {
    signIn('facebook')
    clearLocalPreTokenSocial()
  }

  // side effects
  useEffect(() => {
    if (message) {
      if (isError) {
        toast.error(message)

        // Reset the state
        dispatch(resetInitialState())
      } else if (isSuccess) {
        toast.success(message)

        // Reset the state
        dispatch(resetInitialState())
        router.push(ROUTE_CONFIG.LOGIN)
      }
    }
  }, [isError, isSuccess, message])

  // check auth register google
  useEffect(() => {
    // the condition to fix the issue that every time the page reloads then the register of Google will be dispatched and push the toast message
    if ((session as any)?.accessToken && (session as any)?.accessToken !== prevLocalSocialToken) {
      if ((session as any)?.provider === 'facebook') {
        dispatch(registerAuthFacebookAsync((session as any)?.accessToken))
      } else {
        dispatch(registerAuthGoogleAsync((session as any)?.accessToken))
      }
      setLocalPreTokenSocial((session as any)?.accessToken)
    }
  }, [(session as any)?.accessToken])

  return (
    <>
      {isLoading && <FallbackSpinner />}
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
            src={theme.palette.mode === 'light' ? RegisterLight : RegisterDark}
            alt='Register image'
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
            {t('register')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ mt: 2 }} width={{ md: '350px', xs: 'auto' }}>
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
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }} width={{ md: '350px', xs: 'auto' }}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.password)}
                      variant='outlined'
                      placeholder={t('enter_current_password')}
                      fullWidth
                      helperText={errors?.password?.message}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                              {!showPassword ? (
                                <IconifyIcon icon='material-symbols-light:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols-light:visibility-off-rounded' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>

            <Box sx={{ mt: 2 }} width={{ md: '350px', xs: 'auto' }}>
              <Controller
                name='confirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.confirmPassword)}
                      placeholder={t('enter_confirm_password')}
                      variant='outlined'
                      fullWidth
                      helperText={errors?.confirmPassword?.message}
                      type={showConfirmPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {!showConfirmPassword ? (
                                <IconifyIcon icon='material-symbols-light:visibility-outline' />
                              ) : (
                                <IconifyIcon icon='material-symbols-light:visibility-off-rounded' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>
            <Button type='submit' fullWidth variant='contained' color='primary' sx={{ m: 2 }}>
              {t('register')}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  style={{
                    color: `rgb(${theme.palette.mode === 'light' ? theme.palette.customColors.light : theme.palette.customColors.dark})`
                  }}
                  href='/login'
                >
                  {`${t('have_account_already')} ${t('sign_in')}`}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Typography sx={{ my: 2 }}>{t('or')}</Typography>
          <Box>
            <IconButton sx={{ color: theme.palette.error.main }} onClick={handleSignupGoogle}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                fontSize='1.375rem'
                className='iconify iconify--mdi'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z'
                ></path>
              </svg>
            </IconButton>
            <IconButton sx={{ color: '#497ce2' }} onClick={handleSignupFacebook}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                fontSize='1.375rem'
                className='iconify iconify--mdi'
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
              >
                <path
                  fill='currentColor'
                  d='M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z'
                ></path>
              </svg>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
