import classNames from 'classnames/bind'
import React from 'react'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import Modal, { IModalProps } from 'components/UI/Modal/Modal'
import s from './BaseModal.module.scss'

interface IProps extends IModalProps {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  handleClose?: () => void
  children?: React.ReactNode
  closeOnBackdropClick?: boolean
  withoutCloseBtn?: boolean
}

const BaseModal = ({
  isOpen,
  setIsOpen,
  handleClose,
  children,
  modalClassName,
  withoutCloseBtn,
  closeOnBackdropClick = true,
  ...rest
}: IProps) => {
  const cx = classNames.bind(s)

  const closeModal = () => {
    setIsOpen(false)
    handleClose && handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      modalClassName={cx(modalClassName, 'baseModal')}
      isRelativeToParent={false}
      closeOnBackdropClick={closeOnBackdropClick}
      {...rest}
    >
      {!withoutCloseBtn && (
        <button onClick={closeModal}>
          <SvgIcon iconName='close' svgProp={{ className: s.close }} />
        </button>
      )}
      <div className={s.container}>{children}</div>
    </Modal>
  )
}

export default BaseModal
