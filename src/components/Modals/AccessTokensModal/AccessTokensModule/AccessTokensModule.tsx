import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import store from 'store2'
import { IApiService, IUserApiKey, LM_Service } from 'types/types'
import { KEYS_MISSING } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { getTokens } from 'api/getTokens'
import { useAssistants } from 'hooks/useAssistants'
import { checkRequiredKeysAvailability } from 'utils/checkRequiredKeysAvailability'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { getValidationSchema } from 'utils/getValidationSchema'
import { Input } from 'components/Input/Input'
import SkillDropboxSearch from 'components/SkillDropboxSearch/SkillDropboxSearch'
import SvgIcon from 'components/SvgIcon/SvgIcon'
import { Wrapper } from 'components/UI'
import s from './AccessTokensModule.module.scss'

interface FormValues {
  token: string
  service: LM_Service
}

export const AccessTokensModule = () => {
  const { t } = useTranslation()
  const { data: api_services } = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )
  const [tokens, setTokens] = useState<IUserApiKey[] | null>(null)
  const { handleSubmit, reset, control } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const localStorageName = getApiKeysLSId()
  const validationSchema = getValidationSchema()

  const { setUIOption } = useUIOptions()
  const { getCachedDist } = useAssistants()
  const bot = getCachedDist(store.get('vaName'))

  const handleChanges = () => {
    trigger('AccessTokensChanged', {})
    setUIOption({
      name: KEYS_MISSING,
      value: !checkRequiredKeysAvailability(bot!),
    })
  }

  const clearTokens = () => localStorage.removeItem(localStorageName)

  const saveTokens = (newState: IUserApiKey[] | null) => {
    const isTokens = newState !== null && newState?.length > 0

    if (!isTokens) return clearTokens()
    localStorage.setItem(localStorageName, JSON.stringify(newState))
  }

  const deleteToken = (token_id: number) =>
    new Promise((resolve, reject) => {
      const isTokens = tokens !== undefined && tokens !== null

      if (!isTokens)
        return reject(t('modals.access_api_keys.toasts.not_found_token'))
      setTokens(prev => {
        const newState =
          prev?.filter(({ api_service }) => api_service.id !== token_id) ?? prev

        saveTokens(newState)
        return newState
      })

      resolve(true)
    })

  const handleRemoveBtnClick = (token_id: number) => {
    toast
      .promise(deleteToken(token_id), toasts().deleteToken)
      .finally(() => handleChanges())
  }

  const updateToken = (index: number, token: IUserApiKey) =>
    new Promise(resolve => {
      setTokens(prev => {
        const isPrev = prev !== null && prev !== undefined
        const newState = isPrev ? prev : [token]

        if (!isPrev) return newState
        newState?.splice(index, 1, token)
        saveTokens(newState)
        return newState
      })
      resolve(t('modals.access_api_keys.toasts.token_created'))
    })

  const createUserToken = ({ service, token }: FormValues) =>
    new Promise(resolve => {
      const selectedService = api_services?.find(
        ({ id }) => `${id}` === service?.id?.toString()
      )

      const newToken: IUserApiKey = {
        api_service: selectedService!,
        token_value: token,
      }
      const apiTokenIndex = tokens?.findIndex(
        ({ api_service }) =>
          api_service.id.toString() === service?.id?.toString()
      )
      const isIndex = apiTokenIndex !== undefined && apiTokenIndex !== -1

      if (isIndex) {
        trigger('ConfirmApiTokenUpdateModal', {
          serviceName: selectedService?.display_name,
          onContinue: () => {
            updateToken(apiTokenIndex, newToken)
            resolve(t('modals.access_api_keys.toasts.token_updated'))
          },
          onCancel: () =>
            resolve(t('modals.access_api_keys.toasts.token_canceled')),
        })
        return
      }

      setTokens(prev => {
        const newState = prev ?? []

        newState.push(newToken)
        saveTokens(newState)
        return newState
      })

      resolve(t('modals.access_api_keys.toasts.token_added'))
    })

  const onSubmit = (data: FormValues) => {
    toast
      .promise(createUserToken(data), {
        loading: t('modals.access_api_keys.toasts.token_adding'),
        success: data => `${data}`,
        error: data => `${data}`,
      })
      .finally(() => handleChanges())
    reset()
  }

  useEffect(() => setTokens(getLSApiKeys()), [])

  return (
    <div className={s.module}>
      <div className={s.body}>
        <h5 className={s.title}>{t('modals.access_api_keys.header')}</h5>
        <p className={s.annotations}>{t('modals.access_api_keys.desc')}</p>
        <form className={s.add} onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='token'
            label={t('modals.access_api_keys.token_field.label')}
            control={control}
            withEnterButton
            rules={{ required: validationSchema.globals.required }}
            props={{
              placeholder: t('modals.access_api_keys.token_field.placeholder'),
            }}
          />
          <SkillDropboxSearch
            name='service'
            label={t('modals.access_api_keys.service_dropbox.label')}
            list={
              api_services?.map(s => ({
                id: s.id.toString(),
                name: s.name,
                display_name: s.display_name,
              })) || []
            }
            control={control}
            rules={{ required: true }}
            props={{
              placeholder: t(
                'modals.access_api_keys.service_dropbox.placeholder'
              ),
            }}
            withoutSearch
          />
        </form>
        {tokens && (
          <ul className={s.tokens}>
            {tokens.map(({ api_service }: IUserApiKey) => (
              <li className={s.token} key={api_service.id}>
                <SvgIcon svgProp={{ className: s.icon }} iconName='key' />
                <div className={s.tokenName}>{api_service.display_name}</div>
                <div className={s.right}>
                  <button
                    className={s.remove}
                    onClick={() => handleRemoveBtnClick(api_service.id)}
                  >
                    {t('modals.access_api_keys.btns.remove')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={s.footer}>
        <Wrapper>
          <div className={s.container}>
            <div className={s.attention}>
              <SvgIcon iconName='attention' />
            </div>
            <div className={s.annotation}>
              {t('modals.access_api_keys.attention.annotation.first_line')}
              <br />
              {t('modals.access_api_keys.attention.annotation.second_line')}
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
