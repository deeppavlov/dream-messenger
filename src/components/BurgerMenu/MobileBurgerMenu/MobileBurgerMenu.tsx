import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import Logo from 'assets/icons/logo.png'
import { BotInfoInterface } from 'types/types'
import { RIGHT_SP_IS_ACTIVE, TRIGGER_RIGHT_SP_EVENT } from 'constants/constants'
import { trigger } from 'utils/events'
import { MobileBurgerBtn } from 'components/Buttons'
import DumbAssistantSP from 'components/Panels/AssistantSidePanel/DumbAssitantSP'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './MobileBurgerMenu.module.scss'

const MobileBurgerMenu = ({ bot }: { bot: BotInfoInterface }) => {
  const cx = classNames.bind(s)
  const { UIOptions } = useUIOptions()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('translation', {
    keyPrefix: 'topbar.ctx_menus',
  })

  const toggleBurgerMenu = () => {
    setIsOpen(prev => !prev)
    UIOptions[RIGHT_SP_IS_ACTIVE] &&
      trigger(TRIGGER_RIGHT_SP_EVENT, {
        isOpen: false,
      })
  }

  const handleEnterToken = () => {
    trigger('AccessTokensModal', {})
    setIsOpen(false)
  }

  const handleShare = () => {
    trigger('ShareAssistantModal', {})
    setIsOpen(false)
  }

  const handlePropsOpen = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: !UIOptions[RIGHT_SP_IS_ACTIVE],
      children: <DumbAssistantSP bot={bot!} />,
    })
    setIsOpen(false)
  }

  return (
    <div className={s.burger}>
      <div className={s.button} onClick={toggleBurgerMenu}>
        <img src={Logo} />
        <SvgIcon
          iconName='arrow_down'
          svgProp={{ className: cx(isOpen && 'rotate') }}
        />
      </div>
      {createPortal(
        // Portal is needed to use body as parent component and calculate height in % instead of vh (for chrome mobile )
        <div
          className={cx(s.backdrop, isOpen && 'open')}
          onClick={() => setIsOpen(false)}
        >
          <div className={s.menu}>
            <MobileBurgerBtn
              type='dream'
              linkTo='http://deepdream.builders'
              name={t('main_burger.about')}
              handleClick={() => setIsOpen(false)}
            />
            <MobileBurgerBtn
              type='key'
              name={t('assistant_burger.tokens')}
              handleClick={handleEnterToken}
            />
            <MobileBurgerBtn
              type='share'
              name={t('assistant_burger.share')}
              handleClick={handleShare}
            />
            <MobileBurgerBtn
              type='properties'
              name={t('assistant_burger.properties')}
              handleClick={handlePropsOpen}
            />
          </div>
          <div className={s.filler}></div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default MobileBurgerMenu
