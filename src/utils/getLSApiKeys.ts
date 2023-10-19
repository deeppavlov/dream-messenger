import { IUserApiKey } from '../types/types'

/**
 * Get object name of user API keys by
 * @param userId
 */
export const getApiKeysLSId = () => `user_api_keys`

/**
 * Get user API keys from localStorage by
 * @param userId
 */
export const getLSApiKeys = (): IUserApiKey[] | null => {
  const localStorageTokens = localStorage.getItem(getApiKeysLSId())
  return localStorageTokens ? JSON.parse(localStorageTokens) : null
}

export const getLSApiKeyByName = (name: string): string | null => {
  return (
    getLSApiKeys()?.filter(({ api_service }: IUserApiKey) => api_service.display_name === name)?.[0]
      ?.token_value ?? null
  )
}

export const checkLMIsOpenAi = (name: string) => new RegExp('\\b' + 'openai-api' + '\\b').test(name)
