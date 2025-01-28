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
import { ChangePasswordMeAsync, registerAuthAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/components/fall-back'
import { resetInitialState } from 'src/stores/auth'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}
type Inputs = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
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

export const ChangePasswordPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // router
  const router = useRouter()

  // auth
  const { logout } = useAuth()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorChangePasswordMe, isSuccessChangePasswordMe, messageChangePasswordMe } = useSelector(
    (state: RootState) => state.auth
  )

  // translate
  const { t } = useTranslation()

  // react hook form
  const schema = yup
    .object()
    .shape({
      currentPassword: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
      newPassword: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
      confirmNewPassword: yup
        .string()
        .required(t('required_field'))
        .matches(PASSWORD_REG, t('rules_password'))
        .oneOf([yup.ref('newPassword'), ''], t('rules_confirm_new_password'))
    })
    .required()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    const { currentPassword, newPassword } = data
    if (!Object.keys(errors)?.length) {
      dispatch(ChangePasswordMeAsync({ currentPassword, newPassword }))
    }
  }

  useEffect(() => {
    if (messageChangePasswordMe) {
      if (isErrorChangePasswordMe) {
        toast.error(messageChangePasswordMe)
      } else if (isSuccessChangePasswordMe) {
        toast.success(messageChangePasswordMe)
        setTimeout(() => {
          logout()
        }, 500)
      }

      // Reset the state
      dispatch(resetInitialState())
    }
  }, [isErrorChangePasswordMe, isSuccessChangePasswordMe, messageChangePasswordMe])

  return (
    <>
      {isLoading && <FallbackSpinner />}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
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
              width: '600px',
              height: 'auto'
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
            {t('Change_password')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ mt: 2 }} width={{ md: '350px', xs: 'auto' }}>
              <Controller
                name='currentPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.currentPassword)}
                      variant='outlined'
                      label={t('Current_password')}
                      placeholder={t('enter_current_password')}
                      fullWidth
                      helperText={errors?.currentPassword?.message}
                      type={showCurrentPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              {!showCurrentPassword ? (
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
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.currentPassword)}
                      label={t('New_password')}
                      variant='outlined'
                      placeholder={t('enter_new_password')}
                      fullWidth
                      helperText={errors?.newPassword?.message}
                      type={showNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowNewPassword(!showNewPassword)}>
                              {!showNewPassword ? (
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
                name='confirmNewPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.confirmNewPassword)}
                      label={t('Confirm_new_password')}
                      placeholder={t('enter_confirm_new_password')}
                      variant='outlined'
                      fullWidth
                      helperText={errors?.confirmNewPassword?.message}
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                              {!showConfirmNewPassword ? (
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
            <Button type='submit' fullWidth variant='contained' color='primary'>
              {t('Change')}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  style={{
                    color: `rgb(${theme.palette.mode === 'light' ? theme.palette.customColors.light : theme.palette.customColors.dark})`
                  }}
                  href='/login'
                >
                  {'Already have an account? Sign in'}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Typography sx={{ my: 2 }}>OR</Typography>
          <Box>
            <IconButton sx={{ color: theme.palette.error.main }}>
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
            <IconButton sx={{ color: '#497ce2' }}>
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

export default ChangePasswordPage
