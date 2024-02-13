import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  TelegramIcon,
  TelegramShareButton,
  VKIcon,
  VKShareButton,
} from 'react-share'
import { SHARE_MODAL_IS_OPEN } from 'constants/constants'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { Input } from 'components/Input/Input'
import { BaseModal, MockModal } from 'components/Modals'
import { ToastCopySucces } from 'components/UI'
import s from './ShareAssistantModal.module.scss'

export const ShareAssistantModal = () => {
  const cx = classNames.bind(s)
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.share_assistant',
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenMockModal, setIsOpenMockModal] = useState(false)
  const { setUIOption } = useUIOptions()

  const handleEventUpdate = () => {
    setIsOpen(!isOpen)
  }
  const { control, getValues } = useForm({
    defaultValues: { link: window.location.href },
  })
  const url = getValues('link')
  const shareText = t('content_to_share')

  const handleCopyBtnClick = () => {
    navigator.clipboard.writeText(url)

    toast.custom(t => (t.visible ? <ToastCopySucces /> : null), {
      position: 'top-center',
      id: 'copySucces',
      duration: 1000,
    })
  }

  useEffect(() => {
    setUIOption({ name: SHARE_MODAL_IS_OPEN, value: isOpen })
  }, [isOpen])

  useObserver('ShareAssistantModal', handleEventUpdate)

  return (
    <>
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.shareModal}>
          <div className={s.header}>{t('header')}</div>
          <div className={s.main}>
            <div className={s.icons}>
              <VKShareButton
                onClick={() => {
                  setIsOpenMockModal(true)
                }}
                title={shareText}
                children={<VKIcon />}
                url={url}
                openShareDialogOnClick={false}
              />
              <TelegramShareButton
                onClick={() => {
                  setIsOpenMockModal(true)
                }}
                title={shareText}
                children={<TelegramIcon />}
                url={url}
                openShareDialogOnClick={false}
              />
            </div>
          </div>
          <p className={cx('text', 'lines')}>{t('separator_text')}</p>
          <div className={s.bottom}>
            <div className={s.footer}>
              <Input
                name='link'
                control={control}
                big
                props={{ readOnly: true }}
              />
              <Button props={{ onClick: handleCopyBtnClick }} theme='primary'>
                {t('btns.copy')}
              </Button>
            </div>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <Button theme='secondary' long>
                {t('btns.open_link')}
              </Button>
            </a>
          </div>
        </div>
      </BaseModal>
      <MockModal
        isOpenModal={isOpenMockModal}
        setIsOpenMock={setIsOpenMockModal}
      />
    </>
  )
}
