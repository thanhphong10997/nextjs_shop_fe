import Typography from '@mui/material/Typography'
import { ReactElement } from 'react'
import BlankLayout from 'src/views/layouts/BlankLayout'

const Error500 = () => {
  return (
    <Typography variant='h2' sx={{ mb: 1.5 }}>
      Oops, something went wrong!
    </Typography>
  )
}

export default Error500
Error500.getLayout = (page: ReactElement) => <BlankLayout>{page}</BlankLayout>
