import React, { useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
// import { useCheckClickOutside } from 'hooks/useCheckClickOutside'
// import { useCheckDocumentScroll } from 'hooks/useCheckDocumentScroll'
// import { subscribe, unsubscribe } from 'utils/events'
import s from './BaseContextMenu.module.scss'

type TPlace = 'top' | 'right' | 'bottom' | 'left'

interface Props {
  tooltipId: string
  lastEdited?: {
    author: string
    date: string
  }
  children?: JSX.Element | JSX.Element[] | React.ReactNode
  place?: TPlace
  offset?: Partial<{
    x: number
    y: number
  }>
}

const BaseContextMenu: React.FC<Props> = ({
  tooltipId,
  children,
  place = 'right',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <ReactTooltip
      className={s.contextMenu}
      id={tooltipId}
      openOnClick
      clickable
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      place={place}
    >
      <div>{children}</div>
    </ReactTooltip>
  )
}

export default BaseContextMenu
