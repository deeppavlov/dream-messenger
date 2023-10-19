import Logo from 'assets/icons/logo.png'
import MenuToolTip from 'components/MenuToolTip/MenuToolTip'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './BurgerMenu.module.scss'

export const BurgerMenu = () => {
  return (
    <>
      <div className={s.menu} data-tip data-tooltip-id='main'>
        <img src={Logo} />
        <SvgIcon iconName='arrow_down' />
      </div>
      <MenuToolTip tooltipId={'main'} />
    </>
  )
}
