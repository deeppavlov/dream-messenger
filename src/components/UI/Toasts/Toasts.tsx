import { useTranslation } from 'react-i18next'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import s from './Toasts.module.scss'

const BaseToast = ({ children }: any) => {
  return <div className={s.baseToast}>{children}</div>
}

export const ToastCopySucces = () => {
  const { t } = useTranslation()

  return (
    <BaseToast>
      <div className={s.succes}>
        <SvgIcon iconName='success' />
        {t('toasts.copied')}
      </div>
    </BaseToast>
  )
}
