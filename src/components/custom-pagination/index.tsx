// React
import { Box, MenuItem, Pagination, PaginationProps, Select, styled } from '@mui/material'

// Mui
import React, { Ref } from 'react'
import { useTranslation } from 'react-i18next'

type TProps = {
  page: number // current page
  pageSize: number // current row size
  rowLength: number
  pageSizeOptions: number[]
  onChangePagination: (page: number, pageSize: number) => void
}

const StyledPagination = styled(Pagination)<PaginationProps>(({ theme }) => {
  return {
    '& .MuiDataGrid-footerContainer': {
      '.MuiBox-root': {
        flex: 1,
        width: '100% !important'
      }
    },
    '.MuiPagination-ul': {
      flexWrap: 'nowrap'
    }
  }
})

const CustomPagination = React.forwardRef((props: TProps, ref: Ref<any>) => {
  const { page, pageSize, rowLength, pageSizeOptions, onChangePagination, ...rests } = props
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 8px' }}>
      <Box sx={{ mr: 4 }}>
        <span>{t('is_showing')}</span>
        <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>
          {page === 1 ? page : 1 + pageSize} {' - '}
        </span>
        <span style={{ fontWeight: 'bold' }}>{page * pageSize}</span>
        <span style={{ margin: '0 4px' }}>{t('trên')}</span>
        <span style={{ fontWeight: 'bold' }}>{rowLength}</span>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{t('Số dòng hiển thị')}</span>
          <Select
            size='small'
            sx={{
              width: '80px',
              padding: 0

              // '& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input':
            }}
            value={pageSize}
            onChange={e => onChangePagination(1, +e.target.value)}
          >
            {pageSizeOptions.map(opt => {
              return (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              )
            })}
          </Select>
        </Box>
        <StyledPagination color='primary' {...rests} />
      </Box>
    </Box>
  )
})

export default CustomPagination
