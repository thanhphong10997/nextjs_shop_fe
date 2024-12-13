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
import { VerticalItems } from 'src/configs/layout'
import { NextPage } from 'next'
import { Box, styled, Tooltip, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

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
      color: active ? `${theme.palette.primary.main}!important` : `rgba(${theme.palette.customColors.main}, 0.7)`,
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

  // functionality
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

  return (
    <>
      {items.map((item: any) => {
        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{
                backgroundColor:
                  (activePath && item.path === activePath) || !!openItems[item.title]
                    ? `${hexToRGBA(theme.palette.primary.main, 0.08)}!important`
                    : theme.palette.background.default,
                padding: `8px 10px 8px ${level * 10}px`,
                margin: '1px 0'
              }}
              onClick={() => {
                if (item.children) handleClick(item.title)
                handleSelectItem(item.path)
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
                      (activePath && item.path === activePath) || !!openItems[item.title]
                        ? `${theme.palette.primary.main}!important`
                        : theme.palette.background.default
                  }}
                >
                  <Icon
                    icon={item.icon}
                    style={{
                      color:
                        (activePath && item.path === activePath) || !!openItems[item.title]
                          ? theme.palette.customColors.lightPaperBg
                          : `rgba(${theme.palette.customColors.main}, 0.7)`
                    }}
                  />
                </Box>
              </ListItemIcon>
              {!disabled && (
                <Tooltip title={item?.title}>
                  <StyledListItemText
                    primary={item?.title}
                    active={Boolean((activePath && item.path === activePath) || !!openItems[item.title])}
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
                          (activePath && item.path === activePath) || !!openItems[item.title]
                            ? theme.palette.primary.main
                            : `rgba(${theme.palette.customColors.main}, 0.7)`
                      }}
                    />
                  ) : (
                    <Icon icon='ic:round-expand-more' />
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

  React.useEffect(() => {
    if (!drawerIsOpening) setOpenItems({})
  }, [drawerIsOpening])

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        items={VerticalItems}
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
