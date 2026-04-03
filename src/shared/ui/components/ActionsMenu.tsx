'use client';

import { useState, cloneElement } from 'react'

import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const ActionsMenu = ({
  children,
  onOpen,
  onClose,
  icon // можно кастомную кнопку передать
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = e => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget)
    onOpen?.(e)
  }

  const handleClose = e => {
    setAnchorEl(null)
    onClose?.(e)
  }

  return (
    <>
      {icon ? (
        cloneElement(icon, {
          onClick: handleOpen
        })
      ) : (
        <IconButton size='small' onClick={handleOpen}>
          <MoreVertIcon />
        </IconButton>
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={e => e.stopPropagation()}>
        {Array.isArray(children)
          ? children.map((child, i) =>
              cloneElement(child, {
                key: i,
                onClick: e => {
                  child.props.onClick?.(e)
                  handleClose(e)
                }
              })
            )
          : cloneElement(children, {
              onClick: e => {
                children.props.onClick?.(e)
                handleClose(e)
              }
            })}
      </Menu>
    </>
  )
}

export default ActionsMenu
