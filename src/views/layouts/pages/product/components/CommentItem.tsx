import { Avatar, Box, Button, IconButton, Popover, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toFullName } from 'src/utils'
import { getPastTime } from 'src/utils/date'
import CommentInput from './CommentInput'
import { TCommentItemProduct } from 'src/types/comment'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteMyCommentAsync, replyCommentAsync, updateMyCommentAsync } from 'src/stores/comments/actions'
import { useRouter } from 'next/router'
import { ROUTE_CONFIG } from 'src/configs/route'
import { Icon } from '@iconify/react/dist/iconify.js'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import Spinner from 'src/components/spinner'

interface TProps {
  item: TCommentItemProduct
}

const CommentItem = ({ item }: TProps) => {
  const { t, i18n } = useTranslation()

  // auth
  const { user } = useAuth()

  // router
  const router = useRouter()

  // redux
  const {
    isLoading,
    isSuccessDelete: isSuccessDeleteComment,
    isSuccessEdit
  } = useSelector((state: RootState) => state.comments)
  const dispatch: AppDispatch = useDispatch()

  // state
  const [isReply, setIsReply] = useState(false)
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false)
  const [editComment, setEditComment] = useState(false)

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'edit/delete-comment' : undefined

  // handle
  const handleCancelReply = () => {
    setIsReply(false)
    if (editComment) {
      setEditComment(false)
    }
  }

  const handleReply = (comment: string, isEdit: boolean, commentItem?: TCommentItemProduct) => {
    if (comment) {
      if (user) {
        if (isEdit) {
          dispatch(
            updateMyCommentAsync({
              id: commentItem?._id || '',
              content: comment
            })
          )
        } else {
          dispatch(
            replyCommentAsync({
              user: user?._id,
              product: commentItem?.product?.id || '',
              content: comment,
              parent: commentItem?.parent ? commentItem.parent : commentItem?._id || ''
            })
          )
        }
        setIsReply(false)
      } else {
        router.replace({
          pathname: ROUTE_CONFIG.LOGIN,
          query: { returnUrl: router.asPath }
        })
      }
    }
  }

  const handleCloseConfirmDeleteComment = () => {
    setOpenDeleteCommentDialog(false)
  }

  const handleDeleteComment = () => {
    dispatch(deleteMyCommentAsync(item?._id))
  }

  // side effects
  useEffect(() => {
    if (isSuccessDeleteComment) {
      handleCloseConfirmDeleteComment()
    }
  }, [isSuccessDeleteComment])

  useEffect(() => {
    if (isSuccessEdit) {
      setEditComment(false)
    }
  }, [isSuccessEdit])

  return (
    <>
      {isLoading && <Spinner />}
      <ConfirmationDialog
        title={t('title_delete_comment')}
        description={t('confirm_delete_comment')}
        open={openDeleteCommentDialog}
        handleClose={handleCloseConfirmDeleteComment}
        handleCancel={handleCloseConfirmDeleteComment}
        handleConfirm={handleDeleteComment}
      />
      <Box sx={{ width: '100%' }}>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseOptions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              startIcon={<Icon icon='lucide:edit' />}
              variant='text'
              sx={{ mt: 1, height: '30px', ml: '8px', backgroundColor: 'transparent!important' }}
              onClick={() => setEditComment(true)}
            >
              {t('Edit')}
            </Button>
            <Button
              startIcon={<Icon icon='ic:outline-delete' fontSize={30} />}
              variant='text'
              sx={{ mt: 1, height: '30px', ml: '8px', backgroundColor: 'transparent!important' }}
              onClick={() => {
                setOpenDeleteCommentDialog(true)
                handleCloseOptions()
              }}
            >
              {t('delete')}
            </Button>
          </Box>
        </Popover>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
          <Avatar src={item?.user?.avatar} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>
                    {toFullName(
                      item?.user?.lastName || '',
                      item?.user?.middleName || '',
                      item?.user?.firstName || '',
                      i18n.language
                    )}
                  </Typography>
                  <Typography color='secondary'>{getPastTime(new Date(item?.createdAt), t)}</Typography>
                </Box>
              </Box>
              {editComment ? (
                <Box sx={{ width: '100%' }}>
                  <CommentInput isEdit item={item} onApply={handleReply} onCancel={handleCancelReply} />
                </Box>
              ) : (
                <Typography>{item?.content}</Typography>
              )}
            </Box>
            {/* If the user of auth context is also the owner of the comment then the user can delete or remove the comment */}
            {item?.user?.id === user?._id && (
              <IconButton onClick={handleClick}>
                <Icon icon='pepicons-pencil:dots-y' />
              </IconButton>
            )}
          </Box>
        </Box>
        {!editComment && (
          <Box sx={{ ml: '20px', mt: -2 }}>
            <Button
              variant='text'
              sx={{ mt: 1, height: '30px', ml: '8px', backgroundColor: 'transparent!important' }}
              onClick={() => setIsReply(true)}
            >
              {t('reply')}
            </Button>
          </Box>
        )}

        {isReply && (
          <Box sx={{ ml: '40px', mt: -2, mr: '40px' }}>
            <CommentInput item={item} isReply={isReply} onApply={handleReply} onCancel={handleCancelReply} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default CommentItem
