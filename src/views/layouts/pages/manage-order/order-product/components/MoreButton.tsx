import { Icon } from '@iconify/react/dist/iconify.js'
import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { updateOrderProductStatusAsync } from 'src/stores/order-product/actions'
import { TParamsUpdateOrderStatus } from 'src/types/order-product'

type TProps = {
  memoStatusOption: { label: string; value: string }[]
  data: any
}

const MoreButton = (props: TProps) => {
  // props
  const { memoStatusOption, data } = props

  // state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const optionsOpen = Boolean(anchorEl)

  // redux
  const dispatch: AppDispatch = useDispatch()

  // handle
  const handleOptionClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUpdateOrderStatus = (data: TParamsUpdateOrderStatus) => {
    dispatch(updateOrderProductStatusAsync(data))
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon icon='pepicons-pencil:dots-y' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={optionsOpen}
        onClose={handleOptionClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {memoStatusOption?.map(item => {
          return (
            <MenuItem
              key={item?.value}
              sx={{ '& svg': { mr: 2 } }}
              onClick={() => {
                handleUpdateOrderStatus({
                  id: data?._id,
                  status: +item?.value
                })
                handleOptionClose()
              }}
            >
              {item?.label}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default MoreButton
