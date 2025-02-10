// Import Next
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// Import components
import Spinner from 'src/components/spinner'

// Import Images
import ResetPasswordLight from '/public/images/reset-password-light.png'
import ResetPasswordDark from '/public/images/reset-password-dark.png'

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

// others
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// configs
import { PASSWORD_REG } from 'src/configs/regex'
import { ROUTE_CONFIG } from 'src/configs/route'

// redux
import { AppDispatch, RootState } from 'src/stores'
import { useDispatch, useSelector } from 'react-redux'
import { resetPasswordAuthAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

type TProps = {}
type Inputs = {
  newPassword: string
  confirmNewPassword: string
}

export const ResetPasswordPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t } = useTranslation()

  // router
  const router = useRouter()
  const secretKey = router?.query?.secretKey as string

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessResetPassword, isErrorResetPassword, messageResetPassword } = useSelector(
    (state: RootState) => state.auth
  )

  // state
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // yup form
  const schema = yup
    .object()
    .shape({
      newPassword: yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
      confirmNewPassword: yup
        .string()
        .required(t('required_field'))
        .matches(PASSWORD_REG, t('rules_password'))
        .oneOf([yup.ref('newPassword'), ''], t('rules_confirm_password'))
    })
    .required()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = (data: { newPassword: string; confirmNewPassword: string }) => {
    if (!Object.keys(errors)?.length) {
      dispatch(
        resetPasswordAuthAsync({
          newPassword: data?.newPassword,
          secretKey
        })
      )
    }
  }

  // handle

  // side effects
  useEffect(() => {
    // condition to make the toast message does not show in the first time the page loads because the default value of 'isSuccessForgotPassword' is true
    if (messageResetPassword) {
      if (isSuccessResetPassword) {
        toast.success(t('reset_password_success'))
        dispatch(resetInitialState())
        router.push(ROUTE_CONFIG.LOGIN)
      } else if (isErrorResetPassword) {
        toast.error(t('reset_password_error'))
        dispatch(resetInitialState())
      }
    }
  }, [isSuccessResetPassword, isErrorResetPassword, messageResetPassword])

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
            src={theme.palette.mode === 'light' ? ResetPasswordLight : ResetPasswordDark}
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
            {t('reset_password')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ mt: 2 }} width={{ md: '350px', xs: 'auto' }}>
              <Controller
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.newPassword)}
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
                                <Icon icon='material-symbols-light:visibility-outline' />
                              ) : (
                                <Icon icon='material-symbols-light:visibility-off-rounded' />
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
                                <Icon icon='material-symbols-light:visibility-outline' />
                              ) : (
                                <Icon icon='material-symbols-light:visibility-off-rounded' />
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 4, width: '350px' }}>
                {t('send_request')}
              </Button>
              <Button
                startIcon={<Icon icon='uiw:left' />}
                type='submit'
                fullWidth
                variant='outlined'
                color='primary'
                sx={{ mt: 4, width: '350px' }}
                onClick={() => router.push(ROUTE_CONFIG.LOGIN)}
              >
                {t('back_login')}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default ResetPasswordPage
