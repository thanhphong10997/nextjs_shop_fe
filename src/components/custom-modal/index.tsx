// Mui
import { Box, Modal, ModalProps, styled, Typography } from '@mui/material'
import { memo } from 'react'

type TCustomModal = ModalProps & {}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => {
  return {
    zIndex: 1200
  }
})

const CustomModal = (props: TCustomModal) => {
  const { onClose, open, children } = props
  console.log('re-render')

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Box sx={{ maxHeight: '100vh', overflow: 'auto' }}>
          <Box
            sx={{
              height: '100%',
              width: '100vw',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                margin: '40px 0'
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledModal>
  )
}

export default CustomModal
