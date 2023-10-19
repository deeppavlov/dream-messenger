import { useTranslation } from 'react-i18next'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './ErrorToast.module.scss'

export const ErrorToast = ({ text }: { text: string }) => {
  const { t } = useTranslation()

  return (
    <div className={s.toast}>
      <div className={s.attention}>
        <SvgIcon iconName='attention' />
      </div>
      {t(text)}
    </div>
  )
}
