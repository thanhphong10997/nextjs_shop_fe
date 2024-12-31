// React
import * as React from 'react'

// Mui
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText, { ListItemTextProps } from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

// Icon
import { Icon } from '@iconify/react/dist/iconify.js'

// Components
import { TVertical, VerticalItems } from 'src/configs/layout'
import { NextPage } from 'next'
import { Box, styled, Tooltip, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { PERMISSIONS } from 'src/configs/permission'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {
  drawerIsOpening: boolean
}

type TListItems = {
  level: number
  items: any
  disabled: boolean
  openItems: {
    [key: string]: boolean
  }
  setOpenItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
  activePath: string | null
  setActivePath: React.Dispatch<React.SetStateAction<string | null>>
}

type TListItemText = ListItemTextProps & {
  active: boolean
}

const StyledListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => {
  return {
    '.MuiTypography-root': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: active ? `${theme.palette.primary.main}!important` : `${theme.palette.customColors.main}b3`,
      fontWeight: active ? 600 : 400
    }
  }
})

// Collapse all menu items if drawer is closed

// Collapse all menu items if drawer is closed

const RecursiveListItems: NextPage<TListItems> = ({
  items,
  level,
  disabled,
  openItems,
  setOpenItems,
  activePath,
  setActivePath
}) => {
  // theme
  const theme = useTheme()

  // router
  const router = useRouter()

  // handle
  const handleClick = (title: string) => {
    if (!disabled) {
      // setOpenItems(prev => ({
      //   ...prev,
      //   [title]: !openItems[title]
      // }))

      setOpenItems({
        [title]: !openItems[title]
      })
    }
  }
  const handleSelectItem = (path: string) => {
    setActivePath(path)

    if (path) {
      router.push(path)
    }
  }

  const isParentHaveChildActive = (item: TVertical): boolean => {
    if (!item.children) {
      return item.path === activePath
    }

    return item?.children.some((child: TVertical) => isParentHaveChildActive(child))
  }

  return (
    <>
      {items.map((item: any) => {
        // Check if the current parent has an active child
        const isParentActive = isParentHaveChildActive(item)

        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    ? `${hexToRGBA(theme.palette.primary.main, 0.08)}!important`
                    : theme.palette.background.default,
                padding: `8px 10px 8px ${level * 10}px`,
                margin: '1px 0'
              }}
              onClick={() => {
                if (item.children) handleClick(item.title)
                if (item.path) handleSelectItem(item.path)
              }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30px',
                    width: '30px',
                    borderRadius: '8px',
                    backgroundColor:
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                        ? `${theme.palette.primary.main}!important`
                        : theme.palette.background.default
                  }}
                >
                  <Icon
                    icon={item.icon}
                    style={{
                      color:
                        (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                          ? theme.palette.customColors.lightPaperBg
                          : `${theme.palette.customColors.main}b3`
                    }}
                  />
                </Box>
              </ListItemIcon>
              {!disabled && (
                <Tooltip title={item?.title}>
                  <StyledListItemText
                    primary={item?.title}
                    active={Boolean(
                      (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                    )}
                  />
                </Tooltip>
              )}
              {item?.children && item.children.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <Icon
                      icon='ic:round-expand-less'
                      style={{
                        color:
                          (activePath && item.path === activePath) || !!openItems[item.title] || isParentActive
                            ? theme.palette.primary.main
                            : `${theme.palette.customColors.main}b3`
                      }}
                    />
                  ) : (
                    <Icon
                      style={{
                        color: isParentActive ? theme.palette.primary.main : `${theme.palette.customColors.main}b3`
                      }}
                      icon='ic:round-expand-more'
                    />
                  )}
                </>
              )}
            </ListItemButton>

            {item?.children && item.children.length > 0 && (
              <>
                <Collapse key={item.title} in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveListItems
                    disabled={disabled}
                    items={item.children}
                    level={level + 1}
                    openItems={openItems}
                    setOpenItems={setOpenItems}
                    activePath={activePath}
                    setActivePath={setActivePath}
                  />
                </Collapse>
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

export const ListVerticalLayout: NextPage<TProps> = ({ drawerIsOpening }) => {
  const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>({})
  const [activePath, setActivePath] = React.useState<null | string>('')
  const router = useRouter()

  // permission
  const { user } = useAuth()
  const permissionUser = user?.role?.permissions
    ? user?.role?.permissions.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : user?.role?.permissions
    : []

  const listVerticalItems = VerticalItems()

  // handle
  const findParentActivePath = (items: TVertical[], activePath: string) => {
    for (const item of items) {
      if (item.path === activePath) {
        return item.title
      }
      if (item.children && item.children.length > 0) {
        const child = findParentActivePath(item.children, activePath)
        if (child) {
          return item.title
        }
      }
    }

    return ''
  }

  const hasPermission = (item: any, permissionUser: string[]) => {
    return permissionUser.includes(item.permission) || !item.permission
  }

  const formatMenuByPermission = (menu: any[], permissionUser: string[]) => {
    if (menu) {
      return menu.filter(item => {
        if (hasPermission(item, permissionUser)) {
          if (item.children && item.children.length > 0) {
            item.children = formatMenuByPermission(item.children, permissionUser)
          }

          if (!item?.children?.length && !item.path) {
            return false
          }

          // return true in the filter method means return the current item of the array
          return true
        }

        // return false in the filter method means return nothing
        return false
      })
    }

    return []
  }

  const memoFormatMenu = React.useMemo(() => {
    if (permissionUser.includes(PERMISSIONS.ADMIN)) {
      return listVerticalItems
    }

    return formatMenuByPermission(listVerticalItems, permissionUser)
  }, [listVerticalItems, permissionUser])

  React.useEffect(() => {
    if (!drawerIsOpening) setOpenItems({})
  }, [drawerIsOpening])

  React.useEffect(() => {
    if (router.asPath) {
      const parentTitle = findParentActivePath(memoFormatMenu, router.asPath)
      setActivePath(router.asPath)
      if (parentTitle) {
        setOpenItems({
          [parentTitle]: true
        })
      }
    }
  }, [router.asPath])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        items={memoFormatMenu}
        level={1}
        disabled={!drawerIsOpening}
        openItems={openItems}
        setOpenItems={setOpenItems}
        activePath={activePath}
        setActivePath={setActivePath}
      />
    </List>
  )
}
