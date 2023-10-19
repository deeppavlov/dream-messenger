import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import store from 'store2'
import { KEYS_MISSING, START_DIALOG_MODAL_IS_OPEN } from 'constants/constants'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './StartDialogModal.module.scss'

const StartDialogModal = () => {
  const { UIOptions, setUIOption } = useUIOptions()
  const { t } = useTranslation()
  const dialogIsStarted = Boolean(store.get('started'))
  const [isOpen, setIsOpen] = useState(!dialogIsStarted)

  const handleClose = () => {
    store('started', true)
    setUIOption({ name: START_DIALOG_MODAL_IS_OPEN, value: false })
  }

  useEffect(() => {
    setIsOpen(!UIOptions[KEYS_MISSING] && !dialogIsStarted)
    setUIOption({
      name: START_DIALOG_MODAL_IS_OPEN,
      value: !UIOptions[KEYS_MISSING] && !dialogIsStarted,
    })
  }, [UIOptions[KEYS_MISSING], dialogIsStarted])

  return (
    isOpen && (
      <div className={s.modal}>
        <div className={s.container}>
          <button onClick={handleClose}>
            <SvgIcon iconName='close' svgProp={{ className: s.close }} />
          </button>
          <div className={s.header}>
            <div className={s.circle}>
              <SvgIcon iconName='tick-circle' />
            </div>
            {t('modals.start_chat.header')}
          </div>
          <div className={s.body}>
            <p>
              <Trans i18nKey='modals.start_chat.p1' />
            </p>
            <br />
            <p>
              <Trans i18nKey='modals.start_chat.p2' />
            </p>
          </div>
        </div>
      </div>
    )
  )
}

export default StartDialogModal
