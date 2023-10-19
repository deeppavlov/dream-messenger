import classNames from 'classnames/bind'
import dream from 'assets/icons/dream.svg'
// import { trigger } from 'utils/events'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './ContextMenuButton.module.scss'

type TMenuItem = 'dream' | 'properties' | 'renew' | 'share'

interface Props {
  id?: string
  name?: string
  type?: TMenuItem
  theme?: 'dark'
  disabled?: boolean
  linkTo?: string
  children?: React.ReactNode
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ContextMenuButton = ({
  id,
  name,
  type,
  theme,
  disabled,
  linkTo,
  children,
  handleClick,
}: Props) => {
  let cx = classNames.bind(s)

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (disabled) return
    handleClick && handleClick(e)
  }

  const getIconElement = (type: TMenuItem) =>
    type === 'dream' ? (
      <img src={dream} />
    ) : (
      <SvgIcon
        iconName={type}
        svgProp={{
          className: s.icon,
        }}
      />
    )

  return (
    <button
      id={id}
      className={cx('item', disabled && 'disabled', theme && theme)}
      onClick={handleBtnClick}
    >
      {linkTo ? (
        <a
          href={linkTo}
          target='_blank'
          rel='noopener noreferrer'
          className={s.link}
        >
          {type && getIconElement(type)}
          {children || name}
        </a>
      ) : (
        <>
          {type && getIconElement(type)}
          <span>{children || name}</span>
        </>
      )}
    </button>
  )
}

export default ContextMenuButton
