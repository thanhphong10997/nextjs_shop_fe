// Import Mui
import { Box, Button, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import { getDetailsRole } from 'src/services/role'
import Spinner from 'src/components/spinner'

type TCreateEditRole = {
  open: boolean
  onClose: () => void
  roleId?: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { open, onClose, roleId } = props
  const dispatch: AppDispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  // react hook form
  const schema = yup
    .object()
    .shape({
      name: yup.string().required(t('required_field'))
    })
    .required()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { name: string }) => {
    if (!Object.keys(errors)?.length) {
      if (roleId) {
        // update
        dispatch(updateRoleAsync({ name: data?.name, id: roleId }))
      } else {
        dispatch(createRoleAsync({ name: data?.name }))
      }
    }
  }

  // fetch api
  const fetchDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailsRole(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data.name
          })
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
        name: ''
      })
    } else if (roleId) {
      fetchDetailsRole(roleId)
    }
  }, [open, roleId])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {roleId ? t('edit_role') : t('create_role')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                width: '100%',
                padding: '30px 20px',
                borderRadius: '15px'
              }}
            >
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => {
                  // Fixing error: Function components cannot be given refs

                  return (
                    <TextField
                      error={Boolean(errors.name)}
                      variant='outlined'
                      label={t('Role_name')}
                      placeholder={t('enter_name')}
                      fullWidth
                      autoFocus
                      helperText={errors?.name?.message}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {!roleId ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
