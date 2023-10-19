import store from 'store2'
import { BotInfoInterface, IUserApiKey } from 'types/types'

export const checkRequiredKeysAvailability = (dist: BotInfoInterface): boolean => {
  const userApiKeys: IUserApiKey[] = store.get('user_api_keys') || []
  const requiredApiKeys = dist?.required_api_keys || []

  const userKeyIds = userApiKeys.map(k => k.api_service.name)
  const requiredKeyIds = requiredApiKeys.map(k => k.name)

  return requiredKeyIds.every(name => userKeyIds.includes(name))
}
