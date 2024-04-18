import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { KEYS_MISSING, TOKEN_KEY_MODAL_IS_OPEN } from 'constants/constants'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import BaseModal from '../BaseModal/BaseModal'
import s from './TokenRequiredModal.module.scss'

const TokenRequiredModal = () => {
  const { UIOptions } = useUIOptions()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const handleEnterTokenClick = () => {
    trigger('AccessTokensModal', {})
  }

  const missingApiKeyModels = UIOptions[KEYS_MISSING] || []

  useEffect(() => {
    setIsOpen(UIOptions[KEYS_MISSING] && !UIOptions[TOKEN_KEY_MODAL_IS_OPEN])
  }, [UIOptions[KEYS_MISSING], UIOptions[TOKEN_KEY_MODAL_IS_OPEN]])

  const setOpen = (isOpen: boolean) => {
    isOpen
      ? setIsOpen(isOpen)
      : setIsOpen(
          UIOptions[KEYS_MISSING] && !UIOptions[TOKEN_KEY_MODAL_IS_OPEN]
        )
  }

  return (
    <BaseModal
      isOpen={isOpen}
      closeOnBackdropClick={!UIOptions[KEYS_MISSING]}
      setIsOpen={setOpen}
      withoutCloseBtn
      modalClassName={s.modal}
    >
      <h4 className={s.header}>
        <div className={s.attention}>
          <SvgIcon iconName='attention' />
        </div>
        {t('modals.requiredKeys.header', {
          count: missingApiKeyModels.length,
        })}
      </h4>
      <div className={s.body}>
        <Trans
          i18nKey='modals.requiredKeys.annotation'
          count={missingApiKeyModels.length}
          values={{ models: missingApiKeyModels.join(', ') }}
        />
      </div>
      <div className={s.link}>
        <Button theme='ghost' props={{ onClick: handleEnterTokenClick }}>
          {t('modals.requiredKeys.link', {
            count: missingApiKeyModels.length,
          })}
        </Button>
      </div>
    </BaseModal>
  )
}

export default TokenRequiredModal
