// Icons
import { Icon } from '@iconify/react/dist/iconify.js'

// Mui
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Rating,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'

// translate
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'

// types
import { TParamsReviewItem } from 'src/types/reviews'

// others
import { toFullName } from 'src/utils'
import { getPastTime } from 'src/utils/date'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import { deleteReviewAsync } from 'src/stores/reviews/actions'
import EditReview from './EditReview'

type TReviewCard = {
  item: TParamsReviewItem
}

const ReviewCard = (props: TReviewCard) => {
  // translate
  const { t, i18n } = useTranslation()

  // theme
  const theme = useTheme()

  // auth
  const { user } = useAuth()

  // redux
  const {
    isSuccessEdit,
    isErrorEdit,
    messageErrorEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.review)

  // state
  const [openEdit, setOpenEdit] = useState({
    open: false,
    id: ''
  })
  const [openConfirmationDeleteReview, setOpenConfirmationDeleteReview] = useState({
    open: false,
    id: ''
  })

  // props
  const { item } = props
  const fullName = toFullName(
    item?.user?.lastName || '',
    item?.user?.middleName || '',
    item?.user?.firstName || '',
    i18n.language
  )

  // redux
  const dispatch: AppDispatch = useDispatch()

  // handle
  const handleCloseEdit = () => {
    setOpenEdit({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteReview = () => {
    setOpenConfirmationDeleteReview({
      open: false,
      id: ''
    })
  }

  const handleDeleteReview = () => {
    dispatch(deleteReviewAsync(openConfirmationDeleteReview.id))
  }

  useEffect(() => {
    if (isSuccessEdit) {
      handleCloseEdit()
    }
  }, [isSuccessEdit, isErrorEdit, messageErrorEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      handleCloseConfirmDeleteReview()
    }
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      <ConfirmationDialog
        title={t('title_delete_review')}
        description={t('confirm_delete_review')}
        open={openConfirmationDeleteReview.open}
        handleClose={handleCloseConfirmDeleteReview}
        handleCancel={handleCloseConfirmDeleteReview}
        handleConfirm={handleDeleteReview}
      />
      <EditReview open={openEdit.open} onClose={handleCloseEdit} reviewId={openEdit.id} />
      <Card
        key={item?.product?.id}
        sx={{ backgroundColor: theme.palette.background.default, boxShadow: theme.shadows[4], minWidth: '275px' }}
      >
        <CardContent sx={{ padding: '8px 24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: '42px', height: '42px' }} src={item?.user?.avatar} />
            <Box>
              <Typography>{fullName}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating name='half-rating' value={item?.star} precision={0.5} readOnly />
                <Typography>{getPastTime(new Date(item?.updatedAt), t)}</Typography>
              </Box>
            </Box>
          </Box>
          <Typography sx={{ mt: 4 }}>{item?.content}</Typography>
        </CardContent>
        {user?._id === item?.user?._id && (
          <CardActions sx={{ padding: '8px 24px' }}>
            <Tooltip title={t('edit')}>
              <IconButton onClick={() => setOpenEdit({ open: true, id: item?._id })}>
                <Icon icon='lucide:edit' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('delete')}>
              <IconButton onClick={() => setOpenConfirmationDeleteReview({ open: true, id: item?._id })}>
                <Icon icon='ic:outline-delete' />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
      </Card>
    </>
  )
}

export default ReviewCard
