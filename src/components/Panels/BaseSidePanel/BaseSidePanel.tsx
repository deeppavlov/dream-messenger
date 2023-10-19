import { useUIOptions } from 'context'
import React, { FC, useEffect, useState } from 'react'
import { RIGHT_SP_IS_ACTIVE, TRIGGER_RIGHT_SP_EVENT } from 'constants/constants'
import { useObserver } from 'hooks/useObserver'
import { useResize } from 'hooks/useResize'
import SidePanel from 'components/Panels/SidePanel/SidePanel'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './BaseSidePanel.module.scss'

type TTransition = 'left' | 'right'

interface BaseSidePanel {
  isOpen?: boolean
  position?: Partial<{
    top: number | 'auto'
    left: number | 'auto'
    right: number | 'auto'
    bottom: number | 'auto'
  }>
  children?: React.ReactNode
  isClosable?: boolean
  transition?: TTransition | 'none'
}

/**
 * On the one page could be have a few BaseSidePanel components,
 * but with different opening sides, such as `left` or `right`.
 * Use param `transition` to adjust openning side.
 */
export const BaseSidePanel: FC<BaseSidePanel> = ({
  isOpen: propIsOpen,
  position,
  children,
  transition = 'right',
  isClosable: propsIsClosable = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(propIsOpen))
  const [isClosable, setIsClosable] = useState<boolean>(propsIsClosable)
  const [content, setContent] = useState<React.ReactNode>(children)
  const { setUIOption } = useUIOptions()
  const { isScreenXs } = useResize()

  const handleClose = () => setIsOpen(false)

  /**
   * Update BaseSidePanel content, when it's triggered
   */
  const updateState = (data: { detail: BaseSidePanel }) => {
    const { isClosable, children } = data.detail
    const requestToClose = data.detail?.isOpen === false

    if (isClosable !== undefined) {
      setIsClosable(isClosable)
    } else setIsClosable(true)

    if (requestToClose) return handleClose()

    setContent(children)
    setIsOpen(true)
  }

  useObserver(TRIGGER_RIGHT_SP_EVENT, updateState)

  useEffect(() => {
    setUIOption({
      name: RIGHT_SP_IS_ACTIVE,
      value: isOpen,
    })
  }, [isOpen])

  return (
    <SidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
      position={position}
      transition={isScreenXs ? 'none' : transition}
      key={transition}
    >
      <div className={s.baseSidePanel} id={`sp_${transition}`}>
        {isClosable && (
          <button
            id='base_sp_close_btn'
            className={s.close}
            onClick={handleClose}
          >
            <SvgIcon iconName='close' />
          </button>
        )}
        {content}
      </div>
    </SidePanel>
  )
}
