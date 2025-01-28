// Import Mui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

// hook form
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// components
import Spinner from 'src/components/spinner'
import CustomModal from 'src/components/custom-modal'
import CustomSelect from 'src/components/custom-select'
import NoData from 'src/components/no-data'

// others
import { cloneDeep, convertFullName, toFullName } from 'src/utils'
import { getAllCities } from 'src/services/city'
import { useAuth } from 'src/hooks/useAuth'
import { TUserAddresses } from 'src/contexts/types'
import toast from 'react-hot-toast'

type TModalAddAddress = {
  open: boolean
  onClose: () => void
}

type TDefaultValues = {
  fullName: string
  city: string
  address: string
  phoneNumber: string
}

const ModalAddAddress = (props: TModalAddAddress) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // auth
  const { user, setUser } = useAuth()

  // props
  const { open, onClose } = props

  // redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccessUpdateMe, messageUpdateMe, isErrorUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  // react
  const [loading, setLoading] = useState(false)
  const [citiesOption, setCitiesOption] = useState<{ label: string; value: string }[]>([])

  // activeTab = 2 means add a new address, activeTab = 1 means edit the address
  const [activeTab, setActiveTab] = useState(1)
  const [addresses, setAddresses] = useState<TUserAddresses[]>([])
  const [isEdit, setIsEdit] = useState({
    isEdit: false,
    index: 0
  })

  // react hook form
  const schema = yup.object().shape({
    fullName: yup.string().required(t('required_field')),
    phoneNumber: yup.string().required(t('required_field')).min(8, 'The min numbers must from 8'),
    city: yup.string().required(t('required_field')),
    address: yup.string().required(t('required_field'))
  })

  const defaultValues: TDefaultValues = {
    phoneNumber: '',
    city: '',
    address: '',
    fullName: ''
  }
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // handle
  const onSubmit = (data: any) => {
    if (!Object.keys(errors)?.length) {
      console.log('data', data)
      if (activeTab === 2) {
        // const findCity = citiesOption?.find(city => city.value === data?.city)

        const { firstName, middleName, lastName } = convertFullName(data?.fullName, i18n.language)
        const isHaveDefault = addresses.some(address => address?.isDefault)

        if (isEdit?.isEdit) {
          const cloneAddresses = cloneDeep(addresses)
          const findAddress = cloneAddresses[isEdit?.index]
          if (findAddress) {
            findAddress.firstName = firstName
            findAddress.middleName = middleName
            findAddress.lastName = lastName
            findAddress.address = data?.address
            findAddress.city = data?.city
            findAddress.phoneNumber = data?.phoneNumber
          }
          setAddresses(cloneAddresses)
        } else {
          setAddresses([
            ...addresses,
            {
              firstName,
              middleName,
              lastName,
              address: data?.address,
              city: data?.city,
              isDefault: !isHaveDefault,
              phoneNumber: data?.phoneNumber
            }
          ])
        }

        setIsEdit({
          isEdit: false,
          index: 0
        })
        setActiveTab(1)
      }
    }
  }

  const onChangeAddress = (value: string) => {
    const cloneAddresses = cloneDeep(addresses)
    setAddresses(
      cloneAddresses?.map((address: any, index: number) => {
        return {
          ...address,
          isDefault: +value === index
        }
      })
    )
  }

  const handleUpdateAddress = () => {
    dispatch(
      updateAuthMeAsync({
        ...user,
        addresses: addresses
      })
    )
  }

  // fetch api

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
    if (!open) {
      reset({
        ...defaultValues
      })
    }
  }, [open])

  // reset the values of the forms after add new or change an address
  useEffect(() => {
    if (activeTab === 2 && isEdit.isEdit) {
      const findDefault = addresses.find(address => address?.isDefault)
      if (findDefault) {
        const fullName = toFullName(
          findDefault?.lastName || '',
          findDefault?.middleName || '',
          findDefault?.firstName || '',
          i18n.language
        )
        const findCity = citiesOption?.find(city => city?.label === findDefault?.city)
        reset({
          fullName,
          address: findDefault?.address,
          city: findCity ? findCity?.value : '',
          phoneNumber: findDefault?.phoneNumber
        })
      }
    } else {
      reset({
        ...defaultValues
      })
    }
  }, [activeTab])

  useEffect(() => {
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (user) {
      setAddresses(user?.addresses)
    }
  }, [user?.addresses])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isSuccessUpdateMe) {
        toast.success(t('update_address_success'))
        if (user) {
          setUser({
            ...user,
            addresses
          })
        }
      } else if (isErrorUpdateMe) {
        toast.error(t('update_address_success'))
      }
      dispatch(resetInitialState())
      onClose()
    }
  }, [isSuccessUpdateMe, isErrorUpdateMe, messageUpdateMe])

  return (
    <>
      {(isLoading || loading) && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {activeTab === 1 ? t('shipping_address') : t('add_address')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              {activeTab === 1 ? (
                <Box>
                  {addresses.length > 0 ? (
                    <FormControl sx={{}}>
                      <FormLabel
                        id='radio-address-group'
                        sx={{ color: theme.palette.primary.main, fontWeight: 600, minWidth: '220px', mb: 2 }}
                      >
                        {t('select_shipping_address')}
                      </FormLabel>
                      <RadioGroup
                        sx={{ position: 'relative', top: '-8px' }}
                        aria-labelledby='radio-address-group'
                        name='radio-address-group'
                        onChange={e => onChangeAddress(e.target.value)}
                      >
                        {addresses?.map((address, index) => {
                          const findCity = citiesOption?.find(city => city?.value === address?.city)

                          return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <FormControlLabel
                                value={index}
                                control={<Radio checked={address?.isDefault} />}
                                label={`${toFullName(address?.lastName || '', address?.middleName || '', address?.firstName || '', i18n.language)} ${address?.phoneNumber} ${address?.address} ${findCity?.label}`}
                              />
                              {address.isDefault && (
                                <Button
                                  sx={{ border: `1px solid ${theme.palette.primary.main}` }}
                                  onClick={() => {
                                    setActiveTab(2)
                                    setIsEdit({
                                      isEdit: true,
                                      index
                                    })
                                  }}
                                >
                                  {t('Change')}
                                </Button>
                              )}
                            </Box>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <Box sx={{ width: '100%', padding: '20px' }}>
                      <NoData widthImage='60px' heightImage='60px' textNodata={t('no_shipping_address')} />
                    </Box>
                  )}
                  <Box>
                    <Button
                      disabled={addresses.length > 3}
                      sx={{ border: `1px solid ${theme.palette.primary.main}`, mt: 3, mb: 2 }}
                      onClick={() => setActiveTab(2)}
                    >
                      {t('add_new')}
                    </Button>
                  </Box>
                </Box>
              ) : (
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
                            error={Boolean(errors.fullName)}
                            helperText={errors?.fullName?.message}
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
                            error={Boolean(errors.address)}
                            helperText={errors?.address?.message}
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
              )}
            </Box>
            {activeTab === 1 ? (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' color='primary' sx={{ mt: 3, mb: 2 }} onClick={handleUpdateAddress}>
                  {t('update')}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                <Button
                  sx={{ border: `1px solid ${theme.palette.primary.main}`, mt: 3, mb: 2 }}
                  onClick={() => {
                    setActiveTab(1)
                    setIsEdit({
                      isEdit: false,
                      index: 0
                    })
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button type='submit' variant='contained' color='primary' sx={{ mt: 3, mb: 2 }}>
                  {t('confirm')}
                </Button>
              </Box>
            )}
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default ModalAddAddress
