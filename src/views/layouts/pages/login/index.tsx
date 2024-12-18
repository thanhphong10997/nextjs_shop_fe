'use client'

// Import Next
import { NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'

// Import components
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// Import Images
import LoginLight from '/public/images/login-light.png'
import LoginDark from '/public/images/login-dark.png'

// Import Mui
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material'
import { makeStyles } from '@mui/styles'

// Import react hook form
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Import yup
import * as yup from 'yup'

// Import React
import React, { useState } from 'react'

// Import icons
import IconifyIcon from 'src/components/Icon'

// Hooks
import { useAuth } from 'src/hooks/useAuth'
import { error } from 'console'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

type TProps = {}
type Inputs = {
  email: string
  password: string
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

export const LoginPage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t } = useTranslation()

  // context
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isRemember, setIsRemember] = useState(false)
  const schema = yup
    .object()
    .shape({
      email: yup.string().required(t('required_field')).matches(EMAIL_REG, 'Please enter a valid email address!'),
      password: yup
        .string()
        .required(t('required_field'))
        .matches(PASSWORD_REG, 'Password must be contains at least 8 characters and special characters')
    })
    .required()
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      email: 'admin@gmail.com',
      password: '123456789Kha@'
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    if (!Object.keys(errors)?.length) {
      login({ ...data, rememberMe: isRemember }, err => {
        if (err?.response?.data?.typeError === 'INVALID') {
          toast.error(t('the_email_or_password_is_wrong'))
        }
        setError('email', { type: 'invalid', message: 'The email or password is wrong' })
      })
    }
  }

  return (
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
          src={theme.palette.mode === 'light' ? LoginLight : LoginDark}
          alt='Login image'
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
          Sign in
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
                    placeholder='Enter email'
                    variant='outlined'
                    autoFocus
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
                    placeholder='Enter password'
                    variant='outlined'
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
          <FormControlLabel
            control={
              <Checkbox
                value='remember'
                color='primary'
                checked={isRemember}
                onChange={e => setIsRemember(e.target.checked)}
              />
            }
            label='Remember me'
          />
          <Button type='submit' fullWidth variant='contained' color='primary'>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#'>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link
                style={{
                  color: `rgb(${theme.palette.mode === 'light' ? theme.palette.customColors.light : theme.palette.customColors.dark})`
                }}
                href='/register'
              >
                {"Don't have an account? Sign Up"}
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
  )
}

export default LoginPage
