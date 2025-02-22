'use client'

// Import Next
import { NextPage } from 'next'

// Import components
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'

// Import Mui
import { Box, Button, Grid, useTheme, Avatar, IconButton, TextField, FormHelperText } from '@mui/material'

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
import { getAllRoles } from 'src/services/role'

// utils
import { convertFileToBase64, convertFullName, toFullName } from 'src/utils'

// react toast
import toast from 'react-hot-toast'

//  redux
import { useDispatch, useSelector } from 'react-redux'
import { resetInitialState } from 'src/stores/auth'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import { AppDispatch, RootState } from 'src/stores'
import { getAllCities } from 'src/services/city'

type TProps = {}

type Inputs = {
  email: string
  role?: yup.Maybe<string>
  fullName?: yup.Maybe<string>
  city?: yup.Maybe<string>
  address?: yup.Maybe<string>
  phoneNumber: string
}

export const MyProfilePage: NextPage<TProps> = () => {
  // theme
  const theme = useTheme()

  // translate
  const { t, i18n } = useTranslation()

  // react
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([])
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)

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
    email: yup.string().required(t('required_field')).matches(EMAIL_REG, 'Please enter a valid email address!'),
    fullName: yup.string().notRequired(),
    role: isDisabledRole ? yup.string().notRequired() : yup.string().required(t('required_field')),
    phoneNumber: yup.string().required(t('required_field')).min(8, 'The min numbers must from 8'),
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
          role: data?.role,
          city: data?.city,
          avatar
        })
      )
    }
  }

  // fetch api
  const fetchGetAuthMe = async () => {
    setLoading(true)
    console.log('loading', loading)
    await getAuthMe()
      .then(async res => {
        const data = res?.data
        if (data) {
          setAvatar(data?.avatar)
          setIsDisabledRole(!data?.role?.permissions?.length)
          reset({
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            city: data?.city,
            address: data?.address,
            role: data?.role?._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
          })
        }
        setLoading(false)
        console.log('loading', loading)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.roles
        if (data) {
          setRoleOptions(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const fetchAllCities = async () => {
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data?.cities
        if (data) {
          setCitiesOption(
            data?.map((item: { name: string; _id: string }) => {
              return {
                label: item?.name,
                value: item?._id
              }
            })
          )
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (messageUpdateMe) {
      if (isSuccessUpdateMe) {
        toast.success(t('update_profile_success'))
        fetchGetAuthMe()
      } else if (isErrorUpdateMe) {
        toast.error(t('update_profile_success'))
      }
      dispatch(resetInitialState())
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe])

  useEffect(() => {
    fetchGetAuthMe()
  }, [i18n.language])

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
  }, [])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
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
                      flexWrap: 'wrap',
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
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    py: 2,
                    px: 4,
                    gap: 4
                  }}
                  flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                >
                  <Grid item md={6} xs={12}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, onBlur, value } }) => {
                        // Fixing error: Function components cannot be given refs

                        return (
                          <TextField
                            disabled
                            required
                            label={t('Email')}
                            error={Boolean(errors.email)}
                            placeholder={t('enter_your_email')}
                            variant='filled'
                            fullWidth
                            helperText={errors?.email?.message}
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                          />
                        )
                      }}
                    />
                  </Grid>
                  {!isDisabledRole && (
                    <Grid item md={6} xs={12} sx={{ height: '100%' }}>
                      <Controller
                        name='role'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => {
                          // Fixing error: Function components cannot be given refs

                          return (
                            <>
                              <CustomSelect
                                disabled
                                label={t('Role')}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                options={roleOptions}
                                error={Boolean(errors?.role)}
                                placeholder={t('enter_your_role')}
                                fullWidth
                              />
                              {errors?.role?.message && (
                                <FormHelperText
                                  sx={{
                                    color: theme.palette.error.main,
                                    position: 'absolute'
                                  }}
                                >
                                  {errors.role.message}
                                </FormHelperText>
                              )}
                            </>
                          )
                        }}
                      />
                    </Grid>
                  )}
                </Box>
              </Grid>
            </Box>
          </Grid>

          {/* Right side */}
          <Grid container item md={6} xs={12} mt={{ md: 0, xs: 5 }}>
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
                        <TextField
                          label={t('Full_name')}
                          placeholder={t('enter_your_full_name')}
                          variant='filled'
                          fullWidth
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
                        <TextField
                          label={t('Address')}
                          placeholder={t('enter_your_address')}
                          variant='filled'
                          fullWidth
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
                        <>
                          <CustomSelect
                            label={t('City')}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            options={citiesOption}
                            error={Boolean(errors?.city)}
                            placeholder={t('enter_your_city')}
                            fullWidth
                          />
                          {errors?.city?.message && (
                            <FormHelperText
                              sx={{
                                color: theme.palette.error.main,
                                position: 'absolute'
                              }}
                            >
                              {errors.city.message}
                            </FormHelperText>
                          )}
                        </>
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
                        <TextField
                          required
                          label={t('Phone_number')}
                          error={Boolean(errors.phoneNumber)}
                          placeholder={t('enter_your_phone')}
                          variant='filled'
                          value={value}
                          fullWidth
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
    </>
  )
}

export default MyProfilePage
