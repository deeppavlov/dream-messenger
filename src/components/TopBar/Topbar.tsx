import { useUIOptions } from 'context'
import { useParams } from 'react-router-dom'
import {
  KEYS_MISSING,
  RIGHT_SP_IS_ACTIVE,
  SHARE_MODAL_IS_OPEN,
  TOKEN_KEY_MODAL_IS_OPEN,
  TRIGGER_RIGHT_SP_EVENT,
} from 'constants/constants'
import { useAssistants } from 'hooks/useAssistants'
import { useChat } from 'hooks/useChat'
import { useResize } from 'hooks/useResize'
import { trigger } from 'utils/events'
import { BurgerMenu } from 'components/BurgerMenu/BurgerMenu'
import MobileBurgerMenu from 'components/BurgerMenu/MobileBurgerMenu/MobileBurgerMenu'
import DumbAssistantSP from 'components/Panels/AssistantSidePanel/DumbAssitantSP'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './Topbar.module.scss'
import { TopbarBtn } from './components/TopbarBtn'

export const Topbar = () => {
  const { renew } = useChat()
  const { UIOptions } = useUIOptions()
  const { vaName } = useParams()
  const { getCachedDist } = useAssistants()
  const bot = getCachedDist(vaName!)

  const { isScreenXs } = useResize()

  const handleEnterToken = () => {
    trigger('AccessTokensModal', {})
  }

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

  return (
    <div className={s.topbar}>
      {isScreenXs ? <MobileBurgerMenu bot={bot!} /> : <BurgerMenu />}
      <span className={s.assistantName}>{bot?.display_name}</span>

      <div className={s.btns}>
        {!isScreenXs ? (
          <>
            <TopbarBtn
              active={
                UIOptions[TOKEN_KEY_MODAL_IS_OPEN] || UIOptions[KEYS_MISSING]
              }
              handleClick={handleEnterToken}
            >
              <SvgIcon iconName='key' />
              {UIOptions[KEYS_MISSING] && (
                <SvgIcon
                  iconName='alert'
                  svgProp={{ className: s.alertIcon }}
                />
              )}
            </TopbarBtn>
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
          <TopbarBtn
            handleClick={handleRestartDialog}
            disabled={!bot || renew.isLoading}
          >
            <SvgIcon iconName='renew' />
          </TopbarBtn>
        )}
      </div>
    </div>
  )
}
