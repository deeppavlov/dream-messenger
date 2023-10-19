import { useUIOptions } from 'context'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowDown from 'assets/icons/arrow_dwn.svg'
import DB from 'assets/icons/logo.png'
import { BotInfoInterface } from 'types/types'
import { ACTIVE_ASSISTANT_SP_ID } from 'constants/constants'
import { Button } from 'components/Buttons'
import { SidePanelHeader } from 'components/Panels'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './DumbAssitantSP.module.scss'

interface Props {
  bot: BotInfoInterface
}

const DumbAssistantSP = ({ bot }: Props) => {
  const { t } = useTranslation()
  const { setUIOption } = useUIOptions()

  const isDeepyPavlova =
    import.meta.env.VITE_SUB_FOR_DEFAULT_TEMPLATES === bot?.author?.outer_id
  const author = isDeepyPavlova ? 'Dream Builder Team' : bot?.author?.name

  const { MODE } = import.meta.env
  const url = import.meta.env[`VITE_BUILDER_REDIRECT_${MODE}`]

  const dispatchTrigger = (isOpen: boolean) => {
    setUIOption({
      name: ACTIVE_ASSISTANT_SP_ID,
      value: isOpen ? `info_${bot?.id}` : null,
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' aria-selected>
            {t('tabs.properties')}
          </li>
        </ul>
      </SidePanelHeader>
      <div className={s.botInfoSidePanel}>
        <div className={s.header}>
          <span className={s.name}>{bot?.display_name}</span>
        </div>

        <div className={s.author}>
          {isDeepyPavlova ? (
            <img src={DB} alt='Author' />
          ) : (
            <img src={bot?.author?.picture} />
          )}
          <span>{author}</span>
        </div>

        <div className={s.scroll}>
          <div className={s.container}>
            <p className={s.desc}>{bot?.description}</p>
          </div>
        </div>
        <span className={s.like}>
          {t('sidepanels.assistant.like_assistant')}
          <SvgIcon iconName='emoji_wink' />
          <SvgIcon iconName='emoji_cup' />
        </span>
        <div className={s.btns}>
          <div className={s.link}>
            <span>{t('sidepanels.assistant.make_own')}</span>
            <img src={ArrowDown} />
          </div>

          <a href={url} target='_blank' rel='noopener noreferrer'>
            <Button theme='primary'>
              {t('sidepanels.assistant.btns.open_db')}
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}

export default DumbAssistantSP
