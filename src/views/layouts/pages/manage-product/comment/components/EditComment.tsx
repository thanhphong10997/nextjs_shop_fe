// Import Mui
import { Box, Button, Grid, IconButton, Typography, useTheme } from '@mui/material'

// Import React
import React, { memo, useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

// redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'

// components
import CustomModal from 'src/components/custom-modal'
import Spinner from 'src/components/spinner'
import CustomTextArea from 'src/components/text-area'
import { updateCommentAsync } from 'src/stores/comments/actions'
import { getDetailsComment } from 'src/services/comment-product'

type TEditComment = {
  open: boolean
  onClose: () => void
  commentId?: string
}

type TDefaultValues = {
  content: string
}

const EditComment = (props: TEditComment) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // props
  const { open, onClose, commentId } = props

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // react hook form
  const defaultValues: TDefaultValues = {
    content: ''
  }
  const schema = yup
    .object()
    .shape({
      content: yup.string().required(t('required_field'))
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
  const onSubmit = (data: any) => {
    if (!Object.keys(errors)?.length) {
      if (commentId) {
        // update
        dispatch(
          updateCommentAsync({
            id: commentId,
            content: data?.content
          })
        )
      }
    }
  }

  // fetch api

  const fetchDetailsComment = async (id: string) => {
    setLoading(true)
    await getDetailsComment(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            content: data?.content
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  // side effects
  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
    } else if (commentId) {
      fetchDetailsComment(commentId)
    }
  }, [open, commentId])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{ backgroundColor: theme.palette.customColors.bodyBg, padding: '20px', borderRadius: '15px' }}
          minWidth={{ md: '400px', xs: '80vw' }}
          maxWidth={{ md: '40vw', xs: '100vw' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', paddingBottom: '20px' }}>
            <Typography variant='h4' sx={{ fontWeight: 600 }}>
              {t('edit_comment')}
            </Typography>
            <IconButton sx={{ position: 'absolute', top: -24, right: -26 }} onClick={onClose}>
              <Icon icon='ic:baseline-close' fontSize={'26px '} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: '20px', px: 4 }}>
              <Grid container spacing={4}>
                {/* Left side */}
                <Grid container item md={12} xs={12}>
                  <Box sx={{ heigh: '100%', width: '100%' }}>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12} mb={2}>
                        <Controller
                          name='content'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { onChange, onBlur, value } }) => {
                            // Fixing error: Function components cannot be given refs

                            return (
                              <CustomTextArea
                                required
                                label={t('content')}
                                placeholder={t('enter_content')}
                                value={value}
                                error={Boolean(errors?.content)}
                                helperText={errors?.content?.message}
                                minRows={3}
                                maxRows={3}
                                onChange={onChange}
                                onBlur={onBlur}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type='submit' variant='contained' color='primary'>
                {t('update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default memo(EditComment)
