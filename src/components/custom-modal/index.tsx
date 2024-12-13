// Mui
import { Box, Modal, ModalProps, styled, Typography } from '@mui/material'

type TCustomModal = ModalProps & {
  handleClose: () => void
}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => {
  return {
    zIndex: 1300
  }
})

const CustomModal = (props: TCustomModal) => {
  const { handleClose, open, children } = props

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          height: '100%',
          width: '100vw',
          overflow: 'auto'
        }}
      >
        <Box sx={{ maxHeight: '100vh', overflow: 'auto' }}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
