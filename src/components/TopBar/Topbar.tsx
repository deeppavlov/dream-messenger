import { useUIOptions } from 'context'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  RIGHT_SP_IS_ACTIVE,
  SHARE_MODAL_IS_OPEN,
  TRIGGER_RIGHT_SP_EVENT,
} from 'constants/constants'
import { useAssistants } from 'hooks/useAssistants'
import { useChat } from 'hooks/useChat'
import { useResize } from 'hooks/useResize'
import { trigger } from 'utils/events'
import { BurgerMenu } from 'components/BurgerMenu/BurgerMenu'
import MobileBurgerMenu from 'components/BurgerMenu/MobileBurgerMenu/MobileBurgerMenu'
import { Button } from 'components/Buttons'
import DumbAssistantSP from 'components/Panels/AssistantSidePanel/DumbAssitantSP'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './Topbar.module.scss'
import { TopbarBtn } from './components/TopbarBtn'

export const Topbar = () => {
  const { t } = useTranslation()
  const { renew } = useChat()
  const { UIOptions } = useUIOptions()
  const { vaName } = useParams()
  const { getCachedDist } = useAssistants()
  const bot = getCachedDist(vaName!)

  const { isScreenXs, isScreenMd } = useResize()

  const handleShare = () => {
    trigger('ShareAssistantModal', {})
  }

  const handlePropsOpen = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: !UIOptions[RIGHT_SP_IS_ACTIVE],
      children: <DumbAssistantSP bot={bot!} />,
    })
  }

  const handleRestartDialog = () => {
    renew.mutateAsync(vaName!)
  }

  const { MODE } = import.meta.env
  const url = import.meta.env[`VITE_BUILDER_REDIRECT_${MODE}`]

  return (
    <div className={s.topbar}>
      {isScreenXs ? <MobileBurgerMenu bot={bot!} /> : <BurgerMenu />}
      <span className={s.assistantName}>{bot?.display_name}</span>

      <div className={s.btns}>
        {!isScreenXs ? (
          <>
            <a href={url} rel='noopener noreferrer'>
              <Button small theme='primary'>
                {isScreenMd
                  ? t('sidepanels.assistant.btns.open_db_short')
                  : t('sidepanels.assistant.btns.open_db')}
              </Button>
            </a>
            <TopbarBtn
              active={UIOptions[SHARE_MODAL_IS_OPEN]}
              handleClick={handleShare}
            >
              <SvgIcon iconName='share' />
            </TopbarBtn>
            <TopbarBtn
              active={UIOptions[RIGHT_SP_IS_ACTIVE]}
              handleClick={handlePropsOpen}
              disabled={!bot}
            >
              <SvgIcon iconName='properties' />
            </TopbarBtn>
          </>
        ) : (
          <>
            <a href={url} rel='noopener noreferrer'>
              <Button tiny theme='primary'>
                {t('sidepanels.assistant.btns.open_db_short')}
              </Button>
            </a>
            <TopbarBtn
              handleClick={handleRestartDialog}
              disabled={!bot || renew.isLoading}
            >
              <SvgIcon iconName='renew' />
            </TopbarBtn>
          </>
        )}
      </div>
    </div>
  )
}
