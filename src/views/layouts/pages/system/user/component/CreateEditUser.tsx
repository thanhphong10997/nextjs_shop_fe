// Import Mui
import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createUserAsync, updateUserAsync } from 'src/stores/user/actions'

// services
import { getDetailsUser } from 'src/services/user'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

// components
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import CustomSelect from 'src/components/custom-select'

// configs
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// utils
import { convertFileToBase64, convertFullName, toFullName } from 'src/utils'

type TCreateEditUser = {
  open: boolean
  onClose: () => void
  userId?: string
}

type TDefaultValues = {
  fullName: string
  email: string
  password?: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
}

const CreateEditUser = (props: TCreateEditUser) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, userId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([])
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])

  const [showPassword, setShowPassword] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    fullName: '',
    email: '',
    password: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 1,
    city: ''
  }
  const schema = yup
    .object()
    .shape({
      email: yup.string().required(t('required_field')).matches(EMAIL_REG, t('rules_email')),
      password: userId
        ? yup.string().nonNullable()
        : yup.string().required(t('required_field')).matches(PASSWORD_REG, t('rules_password')),
      fullName: yup.string().required(t('required_field')),
      role: yup.string().required(t('required_field')),
      phoneNumber: yup.string().required(t('required_field')).min(8, 'The min numbers must from 8'),
      city: yup.string().nonNullable(),
      address: yup.string().nonNullable(),
      status: yup.number().nonNullable()
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
      const { firstName, middleName, lastName } = convertFullName(data?.fullName, i18n.language)
      if (userId) {
        // update
        dispatch(
          updateUserAsync({
            id: userId,
            firstName,
            middleName,
            lastName,
            password: data?.password || '',
            phoneNumber: data?.phoneNumber,
            email: data?.email,
            role: data?.role,
            address: data?.address,
            city: data?.city,
            avatar: avatar,
            status: data?.status ? 1 : 0
          })
        )
      } else {
        dispatch(
          createUserAsync({
            firstName,
            middleName,
            lastName,
            password: data?.password || '',
            phoneNumber: data?.phoneNumber,
            email: data?.email,
            role: data?.role,
            address: data?.address,
            city: data?.city,
            avatar: avatar
          })
        )
      }
    }
  }

  const handleUploadAvatar = async (file: File) => {
    try {
      const convertBase64 = await convertFileToBase64(file)
      setAvatar(convertBase64 as string)
    } catch (err) {
      console.log('err', { err })

      return
    }
  }

  // fetch api
  const fetchAllRoles = async () => {
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

  const fetchDetailsUser = async (id: string) => {
    setLoading(true)
    await getDetailsUser(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            fullName: toFullName(data?.lastName || '', data?.middleName || '', data?.firstName || '', i18n.language),
            password: data?.password,
            phoneNumber: data?.phoneNumber,
            email: data?.email,
            role: data?.role?._id,
            address: data?.address,
            city: data?.city,
            status: data?.status
          })
          setAvatar(data?.avatar)
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
      setAvatar('')
      setShowPassword(false)
    } else if (userId) {
      fetchDetailsUser(userId)
    }
  }, [open, userId])

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
  }, [])

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
              {userId ? t('edit_user') : t('create_user')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container spacing={4}>
                {/* Left side */}
                <Grid container item md={6} xs={12}>
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
                              <TextField
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
                      <Grid item md={6} xs={12}>
                        <Controller
                          name='role'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <>
                                <CustomSelect
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
                      {!userId && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            name='password'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => {
                              // Fixing error: Function components cannot be given refs

                              return (
                                <TextField
                                  required
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
                        </Grid>
                      )}
                      {userId && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            name='status'
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => {
                              // Fixing error: Function components cannot be given refs

                              return (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={event => {
                                        onChange(event?.target.checked ? 1 : 0)
                                      }}
                                    />
                                  }
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              )
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                {/* Right side */}
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={5}>
                      <Grid item md={12} xs={12}>
                        <Controller
                          name='fullName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <TextField
                                required
                                label={t('Full_name')}
                                placeholder={t('enter_your_full_name')}
                                variant='filled'
                                fullWidth
                                value={value}
                                error={Boolean(errors.fullName)}
                                helperText={errors?.fullName?.message}
                                onBlur={onBlur}
                                onChange={onChange}
                              />
                            )
                          }}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
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
                      <Grid item md={12} xs={12}>
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
                      <Grid item md={12} xs={12}>
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
                                placeholder={t('enter_your_phone')}
                                variant='filled'
                                value={value}
                                fullWidth
                                error={Boolean(errors.phoneNumber)}
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
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='submit' variant='contained' color='primary' sx={{ mt: 3, mb: 2 }}>
                {!userId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
