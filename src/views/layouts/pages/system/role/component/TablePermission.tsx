// Import Mui
import { Checkbox, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// Import React
import React, { useEffect, useState } from 'react'

// Translate
import { useTranslation } from 'react-i18next'

// config
import { LIST_DATA_PERMISSIONS, PERMISSIONS } from 'src/configs/permission'

// Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'

// component
import Spinner from 'src/components/spinner'
import CustomDataGrid from 'src/components/custom-data-grid'
import { getAllObjectValues } from 'src/utils'

type TTablePermission = {
  selectedPermission: string[]
  setSelectedPermission: React.Dispatch<React.SetStateAction<string[]>>
  disabled: boolean
}

const TablePermission = (props: TTablePermission) => {
  // props
  const { selectedPermission, setSelectedPermission, disabled } = props

  // translate
  const { t } = useTranslation()

  // theme
  const theme = useTheme()

  // redux
  const dispatch: AppDispatch = useDispatch()

  // react
  const [loading, setLoading] = useState(false)

  // handle
  // optional parameter must be placed after other parameters
  const getValuePermission = (value: string, mode: string, parentValue?: string) => {
    try {
      return parentValue ? PERMISSIONS[parentValue]?.[value][mode] : PERMISSIONS[value]
    } catch {
      return ''
    }
  }

  const handleOnChangeCheckBox = (value: string) => {
    const isChecked = selectedPermission.includes(value)
    if (isChecked) {
      // if user uncheck
      const filteredItems = selectedPermission.filter(item => item !== value)
      setSelectedPermission(filteredItems)
    } else {
      setSelectedPermission([...selectedPermission, value])
    }
  }

  const handleIsChecked = (value: string, parentValue?: string) => {
    const allValue = parentValue
      ? getAllObjectValues(PERMISSIONS[parentValue][value])
      : getAllObjectValues(PERMISSIONS[value])
    const isCheckedAll = allValue.every((item: any) => selectedPermission.includes(item))

    return {
      isChecked: isCheckedAll,
      allValue
    }
  }

  const handleCheckAllCheckBox = (value: string, parentValue?: string) => {
    const { isChecked: isCheckedAll, allValue } = handleIsChecked(value, parentValue)
    if (isCheckedAll) {
      const filteredItems = selectedPermission.filter(item => !allValue.includes(item))
      setSelectedPermission(filteredItems)
    } else {
      setSelectedPermission([...new Set([...selectedPermission, ...allValue])])
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'all',
      headerName: '',
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const { isChecked } = handleIsChecked(row.value, row.parentValue)

        return (
          <>
            {!row?.isHideAll && (
              <Checkbox
                disabled={disabled}
                value={row?.value}
                checked={isChecked}
                onChange={e => {
                  if (row.isParent) {
                    handleCheckAllCheckBox(e.target.value)
                  } else {
                    handleCheckAllCheckBox(e.target.value, row?.parentValue)
                  }
                }}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Typography
            sx={{
              color: row?.isParent ? theme.palette.primary.main : `${theme.palette.customColors.main}c7`,
              paddingLeft: row?.isParent ? 0 : '20px',
              textTransform: row?.isParent ? 'uppercase' : 'normal'
            }}
          >
            {t(row?.name)}
          </Typography>
        )
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
        const value = getValuePermission(row.value, 'VIEW', row.parentValue)

        return (
          <>
            {!row?.isHideView && !row?.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={selectedPermission.includes(value)}
              />
            )}
          </>
        )
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
        const value = getValuePermission(row.value, 'CREATE', row.parentValue)

        return (
          <>
            {!row?.isHideCreate && !row?.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={selectedPermission.includes(value)}
              />
            )}
          </>
        )
      }
    },
    {
      field: 'edit',
      headerName: t('Edit'),
      minWidth: 80,
      maxWidth: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params
        const value = getValuePermission(row.value, 'UPDATE', row.parentValue)

        return (
          <>
            {!row?.isHideUpdate && !row?.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={selectedPermission.includes(value)}
              />
            )}
          </>
        )
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
        const value = getValuePermission(row.value, 'DELETE', row.parentValue)

        return (
          <>
            {!row?.isHideDelete && !row?.isParent && (
              <Checkbox
                disabled={disabled}
                value={value}
                onChange={e => handleOnChangeCheckBox(e.target.value)}
                checked={selectedPermission.includes(value)}
              />
            )}
          </>
        )
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
