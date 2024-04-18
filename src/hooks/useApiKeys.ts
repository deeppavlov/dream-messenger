import { AxiosError } from 'axios'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { IApiService, IModelValidationState, LM_Service } from 'types/types'
import { getAllLMservices } from 'api/getAllLMservices'
import { getTokens } from 'api/getTokens'
import { validateApiKey } from 'api/validateApiKey'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { isKeyRequiredForModel, saveTokens } from 'utils/localStorageTokens'

interface ICheckData {
  lmService: LM_Service
  tokenValue: string
}

export const useApiKeys = () => {
  const [validationState, setValidationState] = useState<IModelValidationState>(
    { status: 'unchecked' }
  )

  const updateLsValidationState = (
    newState: IModelValidationState,
    lmServiceName: string
  ) => {
    const newLsApiKeys = lsApiKeys.map(key => {
      if (isKeyRequiredForModel(key, lmServiceName)) {
        key.lmValidationState[lmServiceName] = newState
      }
      return key
    })
    saveTokens(localStorageName, newLsApiKeys)
    trigger('AccessTokensChanged', [])
  }

  const lsApiKeys = getLSApiKeys() || []
  const localStorageName = getApiKeysLSId()

  const checkApiKey = useMutation({
    mutationFn: ({ lmService, tokenValue }: ICheckData) => {
      setValidationState({ status: 'loading' })
      updateLsValidationState({ status: 'loading' }, lmService.name)
      return validateApiKey(tokenValue, lmService)
    },
    onSuccess: (_, { lmService }) => {
      const newValidationState: IModelValidationState = { status: 'valid' }
      setValidationState(newValidationState)
      updateLsValidationState(newValidationState, lmService.name)
    },
    onError: (err: AxiosError, { lmService }) => {
      const errorMessage =
        err.response?.data?.message || err.response?.data?.detail
      const newValidationState: IModelValidationState = {
        status: 'invalid',
        message:
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Something went wrong', // crutch: errorMessage can be either a string or an array of objects
      }
      setValidationState(newValidationState)
      updateLsValidationState(newValidationState, lmService.name)
    },
  })

  const apiServices = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )

  const lmServices = useQuery('all_lm_services', () => getAllLMservices(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  return {
    validationState,
    setValidationState,
    checkApiKey,
    apiServices,
    lmServices,
  }
}
