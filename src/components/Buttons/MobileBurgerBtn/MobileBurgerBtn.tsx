import classNames from 'classnames/bind'
import dream from 'assets/icons/dream.svg'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './MobileBurgerBtn.module.scss'

type TMenuItem = 'dream' | 'properties' | 'share' | 'key'

interface Props {
  name?: string
  type?: TMenuItem
  linkTo?: string
  children?: React.ReactNode
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const MobileBurgerBtn = ({ name, type, linkTo, handleClick }: Props) => {
  let cx = classNames.bind(s)

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleClick && handleClick(e)
  }

  const getIconElement = (type: TMenuItem) =>
    type === 'dream' ? (
      <img className={s.icon} src={dream} />
    ) : (
      <SvgIcon
        iconName={type}
        svgProp={{
          className: s.icon,
        }}
      />
    )

  return (
    <button className={cx('item')} onClick={handleBtnClick}>
      {linkTo ? (
        <a
          href={linkTo}
          target='_blank'
          rel='noopener noreferrer'
          className={s.link}
        >
          {type && getIconElement(type)}
          {name}
        </a>
      ) : (
        <>
          {type && getIconElement(type)}
          <span>{name}</span>
        </>
      )}
    </button>
  )
}

export default MobileBurgerBtn
