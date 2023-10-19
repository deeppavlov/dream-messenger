import classNames from 'classnames/bind'
import { FC, ReactNode, useRef } from 'react'
import s from './Main.module.scss'

interface Props {
  children: ReactNode
}

export const Main: FC<Props> = ({ children }) => {
  let cx = classNames.bind(s)
  const contentWrapper = useRef<HTMLDivElement>(null)

  return (
    <div data-id='main' ref={contentWrapper} className={cx('main', 'sidebar')}>
      {children}
    </div>
  )
}
