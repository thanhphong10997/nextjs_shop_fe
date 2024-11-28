// React
import * as React from 'react'

// Mui
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'

// Icon
import { Icon } from '@iconify/react/dist/iconify.js'

// Components
import { VerticalItems } from 'src/configs/layout'
import { NextPage } from 'next'

type TProps = {
  drawerIsOpening: boolean
}

export const ListVerticalLayout: NextPage<TProps> = ({ drawerIsOpening }) => {
  const [openItem, setOpenItem] = React.useState<{ [key: string]: boolean }>({})

  // Collapse all menu items if drawer is closed

  React.useEffect(() => {
    if (!drawerIsOpening) setOpenItem({})
  }, [drawerIsOpening])

  // Collapse all menu items if drawer is closed

  const RecursiveListItems = ({ item, level, disabled }: { item: any; level: number; disabled: boolean }) => {
    const handleClick = (title: string) => {
      if (!disabled) {
        setOpenItem(prev => ({
          ...prev,
          [title]: !prev[title]
        }))
      }
    }

    return (
      <>
        {item.map((item: any) => {
          return (
            <React.Fragment key={item.title}>
              <ListItemButton
                disabled={!drawerIsOpening}
                sx={{
                  padding: `8px 10px 8px ${level * 10}px`
                }}
                onClick={() => {
                  if (item.children) handleClick(item.title)
                }}
              >
                <ListItemIcon>
                  <Icon icon={item.icon} />
                </ListItemIcon>
                {!disabled && <ListItemText primary={item?.title} />}
                {item?.children && item.children.length > 0 && (
                  <>
                    {openItem[item.title] ? <Icon icon='ic:round-expand-less' /> : <Icon icon='ic:round-expand-more' />}
                  </>
                )}
              </ListItemButton>
              {item?.children && item.children.length > 0 && (
                <>
                  <Collapse key={item.title} in={openItem[item.title]} timeout='auto' unmountOnExit>
                    <RecursiveListItems disabled={!drawerIsOpening} item={item.children} level={level + 1} />
                  </Collapse>
                </>
              )}
            </React.Fragment>
          )
        })}
      </>
    )
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems item={VerticalItems} level={1} disabled={!drawerIsOpening} />
    </List>
  )
}
