// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import { Typography } from '@mui/material'

// image
import Nodata from '../../../public/svgs/no-data.svg'

// next
import Image from 'next/image'

// translate
import { useTranslation } from 'react-i18next'

type TProps = {
  widthImage?: string
  heightImage?: string
  textNodata?: string
}

const NoData = (props: TProps) => {
  // ** Hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme()
  const { t } = useTranslation()

  const { widthImage, heightImage, textNodata = t('No_data') } = props

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Image
        width={0}
        height={0}
        src={Nodata}
        alt='no-data'
        style={{ width: widthImage, height: heightImage, objectFit: 'cover', maxHeight: '200px', maxWidth: '200px' }}
      />
      <Typography sx={{ whiteSpace: 'nowrap' }}>{textNodata}</Typography>
    </Box>
  )
}

export default NoData
