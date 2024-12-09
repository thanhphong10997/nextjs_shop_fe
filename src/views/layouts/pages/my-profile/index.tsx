'use client'

// Import Next
import { NextPage } from 'next'

// Import components
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import CustomTextField from 'src/components/text-field'
import WrapperFileUpload from 'src/components/wrapper-file-upload'

// Import Mui
import { Box, Button, Grid, useTheme, Avatar, IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'

// Import react hook form
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Import yup
import * as yup from 'yup'

// Import React
import React, { useEffect, useState } from 'react'

// i18n(translate)
import { useTranslation } from 'react-i18next'

// iconify
import { Icon } from '@iconify/react/dist/iconify.js'

// services
import { getAuthMe } from 'src/services/auth'

// types
import { UserDataType } from 'src/contexts/types'

// utils
import { convertFileToBase64, convertFullName, toFullName } from 'src/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/apps/auth'
import { updateAuthMeAsync } from 'src/stores/apps/auth/actions'
import FallbackSpinner from 'src/components/fall-back'

type TProps = {}

type Inputs = {
  email: string
  role: string
  fullName?: yup.Maybe<string>
  city?: yup.Maybe<string>
  address?: yup.Maybe<string>
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

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [user, setUser] = useState<UserDataType | null>(null)
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [roleId, setRoleId] = useState('')

  // redux
  const { isLoading, isSuccessUpdateMe, messageUpdateMe, isErrorUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )
  const dispatch: AppDispatch = useDispatch()

  const handleUploadAvatar = async (file: File) => {
    try {
      const convertBase64 = await convertFileToBase64(file)
      setAvatar(convertBase64 as string)
    } catch (err) {
      console.log('err', { err })

      return
    }
  }

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'Please enter a valid email address!'),
    fullName: yup.string().notRequired(),
    role: yup.string().required('The field is required'),
    phoneNumber: yup.string().required('The field is required').min(8, 'The min numbers must from 8'),
    city: yup.string().notRequired(),
    address: yup.string().notRequired()
  })

  const defaultValues: Inputs = {
    email: '',
    phoneNumber: '',
    role: '',
    city: '',
    address: '',
    fullName: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Inputs> = (data: any) => {
    console.log('data', data)
    if (data) {
      const { firstName, middleName, lastName } = convertFullName(data?.fullName, i18n.language)
      dispatch(
        updateAuthMeAsync({
          email: data.email,
          address: data.address,
          phoneNumber: data.phoneNumber,
          firstName,
          middleName,
          lastName,
          role: roleId,
          avatar
        })
      )
    }
  }

  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async res => {
        const data = res?.data
        console.log('res', res)
        if (data) {
          setRoleId(data?.role?.id)
          setAvatar(data?.avatar)
          setUser({ ...res?.data?.data })
          reset({
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            city: data?.city,
            address: data?.address,
            role: data?.role?.name,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
          })
        }
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (messageUpdateMe) {
      if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      } else if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe])

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n.language])

  return (
    <>
      {loading || isLoading ? (
        <FallbackSpinner />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container>
            {/* Left side */}
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
                      <Box
                        sx={{
                          position: 'relative'
                        }}
                      >
                        {avatar ? (
                          <>
                            <IconButton
                              sx={{
                                position: 'absolute',
                                bottom: -12,
                                right: -12,
                                zIndex: 2
                              }}
                              onClick={() => setAvatar('')}
                            >
                              <Icon icon='fluent:delete-32-regular' />
                            </IconButton>
                            <Avatar src={avatar} sx={{ width: 100, height: 100 }} />
                          </>
                        ) : (
                          <>
                            <Avatar sx={{ width: 100, height: 100 }}>
                              <Icon icon='ph:user-thin' fontSize={50} />
                            </Avatar>
                          </>
                        )}
                      </Box>

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
                          {avatar ? t('change_avatar') : t('upload_avatar')}
                        </Button>
                      </WrapperFileUpload>
                    </Box>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <CustomTextField
                            disabled
                            required
                            label={t('Email')}
                            error={Boolean(errors.email)}
                            placeholder={t('enter_your_email')}
                            variant='filled'
                            fullWidth
                            autoFocus
                            helperText={errors?.email?.message}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
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
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

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
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
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
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <CustomTextField
                            label={t('Full_name')}
                            placeholder={t('enter_your_full_name')}
                            variant='filled'
                            fullWidth
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='address'
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <CustomTextField
                            label={t('Address')}
                            placeholder={t('enter_your_address')}
                            variant='filled'
                            fullWidth
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='city'
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <CustomTextField
                            label={t('City')}
                            placeholder={t('enter_your_city')}
                            variant='filled'
                            fullWidth
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='phoneNumber'
                      rules={{ required: true }}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <CustomTextField
                            required
                            label={t('Phone_number')}
                            error={Boolean(errors.phoneNumber)}
                            placeholder={t('enter_your_phone')}
                            variant='filled'
                            value={value}
                            fullWidth
                            autoFocus
                            helperText={errors?.phoneNumber?.message}
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*',
                              minLength: 8
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
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', height: '100%' }}>
            <Button type='submit' variant='contained' color='primary' sx={{ margin: '12px 0' }}>
              {t('update')}
            </Button>
          </Box>
        </form>
      )}
    </>
  )
}

export default MyProfilePage
