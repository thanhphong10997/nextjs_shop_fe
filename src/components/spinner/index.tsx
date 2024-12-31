// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { Modal, ModalProps } from '@mui/material'

// Custom components
import CircularWithValueLabel from '../custom-circular-process'

const CustomModal = styled(Modal)<ModalProps>(({ theme }) => {
  return {
    '&.MuiModal-root': {
      width: '100%',
      height: '100%',
      zIndex: 2000,
      '.MuiModal-backdrop': {
        backgroundColor: `${theme.palette.customColors.main}b3`
      }
    }
  }
})

const Spinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()

  return (
    <CustomModal open={true}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <CircularWithValueLabel />
      </Box>
    </CustomModal>
  )
}

export default Spinner
