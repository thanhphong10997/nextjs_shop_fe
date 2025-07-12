// Mui
import { Box, Modal, ModalProps, styled } from '@mui/material'
import { forwardRef, useEffect, useRef } from 'react'

type TCustomModal = ModalProps & {
  onClose: (event: Event, otherArg?: any) => void
}

const StyledModal = styled(Modal)<ModalProps>(({ theme }) => {
  return {
    zIndex: 1200
  }
})

const CustomModal = (props: TCustomModal) => {
  const { onClose, open, children } = props

  const ref = useRef<HTMLInputElement>()

  // handle click outside modal (close if click on the select element => not fixed yet)
  // useEffect(() => {
  //   const handleClickOutside = (event: Event) => {
  //     // console.log(ref.current)
  //     console.log('event', event)
  //     if (
  //       ref.current &&
  //       !ref.current.contains(event.target as HTMLInputElement) &&
  //       event?.target?.toString() !== '[object HTMLBodyElement]'
  //     ) {
  //       console.log('click outside')
  //       if (onClose !== undefined) {
  //         onClose(event)
  //       }
  //     }
  //   }

  //   document.addEventListener('click', handleClickOutside, true)

  //   return () => document.removeEventListener('click', handleClickOutside, true)
  // }, [onClose])

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
              ref={ref}
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
