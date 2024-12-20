// Import Mui
import { Box, Button, Checkbox, IconButton, TextField, Tooltip, Typography, useTheme } from '@mui/material'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// Import icons
import { Icon } from '@iconify/react/dist/iconify.js'
import CustomModal from 'src/components/custom-modal'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'

// hook form
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createRoleAsync, updateRoleAsync } from 'src/stores/role/actions'
import { getDetailsRole } from 'src/services/role'
import Spinner from 'src/components/spinner'
import CustomDataGrid from 'src/components/custom-data-grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { LIST_DATA_PERMISSIONS } from 'src/configs/permission'

type TTablePermission = {}

const TablePermission = (props: TTablePermission) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch: AppDispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `rgba(${theme.palette.customColors.main},0.78)`,
              paddingLeft: row?.isParent ? 0 : '40px'
            }}
          >
            {t(row?.name)}
          </Typography>
        )
      }
    },
    {
      field: 'all',
      headerName: t('All'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{row?.isParent && <Checkbox value={row?.view} />}</>
      }
    },
    {
      field: 'view',
      headerName: t('View'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideView && !row?.isParent && <Checkbox value={row?.view} />}</>
      }
    },
    {
      field: 'create',
      headerName: t('Create'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideCreate && !row?.isParent && <Checkbox value={row?.create} />}</>
      }
    },
    {
      field: 'update',
      headerName: t('Update'),
      minWidth: 100,
      maxWidth: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideUpdate && !row?.isParent && <Checkbox value={row?.update} />}</>
      }
    },
    {
      field: 'delete',
      headerName: t('Delete'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return <>{!row?.isHideDelete && !row?.isParent && <Checkbox value={row?.delete} />}</>
      }
    }
  ]

  return (
    <>
      {loading && <Spinner />}
      <CustomDataGrid
        rows={LIST_DATA_PERMISSIONS}
        columns={columns}
        autoHeight
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooter
      />
    </>
  )
}

export default TablePermission
