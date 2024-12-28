import React, { Ref } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled, useTheme } from '@mui/material'

const StyledCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => {
  return {
    '.MuiDataGrid-selectedRowCount': {
      display: 'none'
    },
    '.MuiDataGrid-columnHeaderTitle': {
      textTransform: 'capitalize',
      color: theme.palette.primary.main
    }
  }
})

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: Ref<any>) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        overflow: 'auto',
        borderRadius: '15px',
        border: `1px solid ${theme.palette.customColors.borderColor}`
      }}
    >
      <StyledCustomGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
