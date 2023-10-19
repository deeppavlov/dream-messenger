import classNames from 'classnames/bind'
import s from './TopbarBtn.module.scss'

interface Props extends React.PropsWithChildren {
  handleClick: () => void
  active?: boolean
  disabled?: boolean
}

export const TopbarBtn = ({
  children,
  handleClick,
  active,
  disabled = false,
}: Props) => {
  const cx = classNames.bind(s)

  return (
    <button
      data-tooltip-id='viewType'
      onClick={handleClick}
      className={cx(disabled ? 'disabled' : 'btn', active && 'active')}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
