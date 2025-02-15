import { Icon } from '@iconify/react/dist/iconify.js'
import { Avatar, Box, BoxProps, Button, IconButton, styled, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { TCommentItemProduct } from 'src/types/comment'
import { useAuth } from 'src/hooks/useAuth'

const StyledWrapper = styled(Box)<BoxProps>(({ theme }) => {
  return {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    '.emoji': {
      position: 'absolute',
      top: '40px !important',
      transform: 'none !important',
      left: 'auto !important',
      zIndex: '2',
      '.EmojiPickerReact': {
        height: '400px!important',
        backgroundColor: `${theme.palette.background.default}`,
        border: `1px solid ${theme.palette.customColors.main}33`,
        boxShadow: theme.shadows[4],
        '.epr-search-container': {
          input: {
            backgroundColor: `${theme.palette.background.default}!important`,
            border: `1px solid ${theme.palette.customColors.main}33`
          }
        },
        '.epr-emoji-category-label': {
          backgroundColor: `${theme.palette.background.default}!important`,
          color: theme.palette.text.primary
        },
        '.epr_iogimd': {
          borderTop: `1px solid ${theme.palette.customColors.main}33`
        }
      }
    }
  }
})

interface TCommentInput {
  item?: TCommentItemProduct
  isEdit?: boolean
  onApply: (comment: string, isEdit: boolean, item?: TCommentItemProduct) => void
  onCancel?: () => void
}

const CommentInput = (props: TCommentInput) => {
  // translate
  const { t } = useTranslation()

  // auth
  const { user } = useAuth()

  // props
  const [inputComment, setInputComment] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isFocus, setIsFocus] = useState(false)

  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    setInputComment(prev => prev + emojiObject?.emoji)

    // close the emoji keyboard after choose one emoji
    // setIsVisible(false)
  }

  // handle
  const handleCancel = () => {
    setIsFocus(false)
    setInputComment('')
    if (props?.onCancel) {
      props?.onCancel()
    }
  }

  const handleApply = () => {
    props.onApply(inputComment, !!props?.isEdit, props?.item)
    setIsFocus(false)
    setInputComment('')
  }

  // side effects
  useEffect(() => {
    if (props?.isEdit && props?.item) {
      setInputComment(props?.item?.content)
    }
  }, [props.isEdit])

  return (
    <StyledWrapper>
      {!props?.isEdit && (
        <Avatar src={user?.avatar || ''} sx={{ height: '40px!important', width: '40px!important', mt: 4 }} />
      )}
      <Box sx={{ flex: 1 }}>
        <TextField
          fullWidth
          variant='standard'
          placeholder={t('Comment...')}
          value={inputComment}
          onFocus={() => setIsFocus(true)}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputComment(e.target.value)}
        />

        {isFocus && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                <Icon fontSize={24} icon='fluent:emoji-24-regular' />
              </IconButton>
              {isVisible ? (
                <div className='emoji'>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              ) : (
                ''
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Button color='secondary' variant='outlined' onClick={handleCancel}>
                {t('cancel')}
              </Button>
              <Button variant='contained' onClick={handleApply}>
                {props?.isEdit ? t('update') : t('comment')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </StyledWrapper>
  )
}

export default CommentInput
