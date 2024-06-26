import { Dispatch, FC, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { IUserApiKey } from 'types/types'
import { toasts } from 'mapping/toasts'
import { useApiKeys } from 'hooks/useApiKeys'
import { trigger } from 'utils/events'
import { getApiKeysLSId } from 'utils/getLSApiKeys'
import { isKeyRequiredForModel, saveTokens } from 'utils/localStorageTokens'
import AccessTokenKey from '../AccessTokenKey/AccessTokenKey'
import s from './AccessTokensTable.module.scss'

interface IProps {
  tokens: IUserApiKey[]
  setTokens: Dispatch<SetStateAction<IUserApiKey[] | null>>
}

export const AccessTokensTable: FC<IProps> = ({ tokens, setTokens }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.access_api_keys',
  })
  const { lmServices } = useApiKeys()

  const localStorageName = getApiKeysLSId()

  const deleteToken = (token_id: number) =>
    new Promise((resolve, reject) => {
      const isTokens = tokens !== undefined && tokens !== null

      if (!isTokens) return reject(t('toasts.not_found_token'))
      setTokens(prev => {
        const newState =
          prev?.filter(({ api_service }) => api_service.id !== token_id) ?? prev

        saveTokens(localStorageName, newState)
        return newState
      })

      resolve(true)
    })

  const handleTokenDeletion = (token_id: number) => {
    toast
      .promise(deleteToken(token_id), toasts().deleteToken)
      .finally(() => trigger('AccessTokensChanged', {}))
  }

  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th className={s.service}>{t('table.service')}</th>
          <th className={s.model}>{t('table.model')}</th>
          <th>{t('table.token')}</th>
          <th>{t('table.status')}</th>
          <th colSpan={2}>{t('table.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map(token => {
          const lmListForToken =
            lmServices.data?.filter(service =>
              isKeyRequiredForModel(token, service.name)
            ) || []

          return (
            <AccessTokenKey
              key={token.id}
              removeApiKey={handleTokenDeletion}
              apiKey={token}
              lmListForToken={lmListForToken}
            />
          )
        })}
      </tbody>
    </table>
  )
}
