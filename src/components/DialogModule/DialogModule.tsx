import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BotInfoInterface, ChatForm, ChatHistory } from 'types/types'
import {
  KEYS_MISSING,
  OPEN_AI_LM,
  RIGHT_SP_IS_ACTIVE,
  START_DIALOG_MODAL_IS_OPEN,
} from 'constants/constants'
import { useChat } from 'hooks/useChat'
import { useChatScroll } from 'hooks/useChatScroll'
import { useResize } from 'hooks/useResize'
import { getAvailableDialogSession } from 'utils/getAvailableDialogSession'
import { getLSApiKeyByName } from 'utils/getLSApiKeys'
import { Button } from 'components/Buttons'
import { Loader, TextLoader } from 'components/Loaders'
import { StartDialogModal } from 'components/Modals'
import { MultilineInput } from 'components/MultilineInput/MultilineInput'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './DialogModule.module.scss'

type Props = {
  bot: BotInfoInterface | undefined
}

const DialogModule = ({ bot }: Props) => {
  const { t } = useTranslation()
  const cx = classNames.bind(s)
  const chatRef = useRef<HTMLDivElement>(null)
  const { UIOptions } = useUIOptions()
  const spIsActive = UIOptions[RIGHT_SP_IS_ACTIVE]
  const { isScreenXs, isScreenMd } = useResize()

  const [apiKey, setApiKey] = useState<string | null>(null)
  const { handleSubmit, reset, control, setFocus } = useForm<ChatForm>({
    mode: 'onSubmit',
  })

  const [formDisabled, setFormDisabled] = useState<boolean>(
    UIOptions[START_DIALOG_MODAL_IS_OPEN]
  )

  const { send, renew, session, history, message, setSession, remoteHistory } =
    useChat()

  const updateApiKey = () => {
    const isOpenAIModelInside = () => {
      return bot?.required_api_keys?.some(key => key?.name === 'openai_api_key')
    }

    if (isOpenAIModelInside()) {
      const openaiApiKey = getLSApiKeyByName(OPEN_AI_LM)
      setApiKey(openaiApiKey)
    }
  }

  useEffect(() => {
    const availableSession = getAvailableDialogSession(bot?.name!)

    availableSession
      ? remoteHistory.mutateAsync(availableSession?.id).finally(() => {
          setSession(availableSession) //FIX
        })
      : bot && renew.mutateAsync(bot?.name!)

    updateApiKey()
  }, [bot])

  useEffect(() => {
    setFormDisabled(
      UIOptions[START_DIALOG_MODAL_IS_OPEN] || UIOptions[KEYS_MISSING] || !bot
    )
  }, [
    UIOptions[START_DIALOG_MODAL_IS_OPEN],
    UIOptions[KEYS_MISSING],
    renew,
    send,
    bot,
  ])

  useChatScroll(chatRef, [history, message, remoteHistory])

  const handleSend = ({ message }: ChatForm) => {
    const isMessage = message?.replace(/\s/g, '').length > 0
    if (!isMessage || send.isLoading) return

    const id = session?.id!

    send.mutate(
      {
        dialog_session_id: id,
        text: message.trim(),
        openai_api_key: apiKey ?? undefined,
      },
      {
        // onError: () => setError('chat'),
      }
    )

    reset()
    const el = document.getElementById('formInput')
    if (el) el.style.cssText = 'height:auto'
  }

  const handleRenewClick = () => {
    renew.mutateAsync(bot?.name!)
    setFocus('message')
  }

  return (
    <section className={cx(s.container, spIsActive && !isScreenMd && s.withSP)}>
      <div className={s.messages}>
        <div className={s.chat} ref={chatRef}>
          {remoteHistory?.isLoading && !remoteHistory?.error ? (
            <div className={s.loaderWrapper}>
              <Loader />
            </div>
          ) : (
            history.map((block: ChatHistory, i: number) => {
              return (
                <div
                  key={`${block?.author == 'bot'}${i}`}
                  className={cx(
                    block?.author == 'bot' ? 'botContainer' : 'userContainer'
                  )}
                >
                  <span
                    className={cx(
                      block?.author == 'bot' ? 'botMessage' : 'message'
                    )}
                  >
                    {block?.text}
                  </span>
                </div>
              )
            })
          )}
          {send?.isLoading && (
            <>
              <div className={s.botContainer}>
                <span className={s.botMessage}>
                  <TextLoader />
                </span>
              </div>
            </>
          )}
        </div>
        <StartDialogModal />
      </div>
      <form className={s.form} onSubmit={handleSubmit(handleSend)}>
        {!isScreenXs && (
          <Button
            theme='secondary'
            clone
            props={{
              disabled: formDisabled || renew.isLoading,
              onClick: handleRenewClick,
              'data-tooltip-id': 'renew',
            }}
          >
            <SvgIcon svgProp={{ className: s.icon }} iconName='renew' />
          </Button>
        )}
        <MultilineInput
          onSubmit={handleSubmit(handleSend)}
          name='message'
          control={control}
          props={{
            placeholder: t('dialog_module.message_field.placeholder'),
            disabled: formDisabled,
            id: 'formInput',
          }}
          withEnterButton={isScreenXs}
        />
        {!isScreenXs && (
          <Button
            props={{
              type: 'submit',
              disabled: formDisabled,
            }}
            clone
            theme='primary'
          >
            <SvgIcon iconName='send' />
          </Button>
        )}
      </form>
      {!isScreenXs && (
        <div className={s.prevention}>
          <SvgIcon iconName='exclamation' />
          {t('dialog_module.chat_warning')}
        </div>
      )}
    </section>
  )
}
export default DialogModule
