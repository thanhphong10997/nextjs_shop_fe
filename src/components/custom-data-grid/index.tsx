import React, { Ref } from 'react'
import Box from '@mui/material/Box'
import { DataGrid, DataGridProps, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { styled } from '@mui/material'

const StyledCustomGrid = styled(DataGrid)<DataGridProps>(({ theme }) => {
  return {
    '&': {
      border: `1px solid ${theme.palette.customColors.borderColor}`
    },
    '.MuiDataGrid-selectedRowCount': {
      display: 'none'
    }
  }
})

const CustomDataGrid = React.forwardRef((props: DataGridProps, ref: Ref<any>) => {
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <StyledCustomGrid {...props} />
    </Box>
  )
})

export default CustomDataGrid
