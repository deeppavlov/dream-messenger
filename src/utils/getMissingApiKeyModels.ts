import { BotInfoInterface } from 'types/types'
import { getLSApiKeys } from './getLSApiKeys'

export const getMissingApiKeyModels = (
  dist: BotInfoInterface | undefined
): string[] | null => {
  const modelsApiKeyRequired = (dist?.used_lm_services || [])
    .filter(service => service.api_key)
    .map(({ name, display_name }) => ({
      name,
      display_name,
    }))

  const requiredKeys = modelsApiKeyRequired.map(m => m.name)

  if (requiredKeys.length > 0) {
    const userApiKeys = getLSApiKeys() || []

    const modelsWithUserKeys = userApiKeys.flatMap(k =>
      Object.entries(k.lmUsageState).reduce((acc: string[], [name, status]) => {
        if (!status) return acc
        return [...acc, name]
      }, [])
    )
    const missingKeys = requiredKeys.filter(
      k => !modelsWithUserKeys.includes(k)
    )

    if (missingKeys.length) {
      const lmServicesWithoutKeys = Array.from(
        new Set(
          modelsApiKeyRequired
            .filter(({ name }) => missingKeys.includes(name))
            .map(({ display_name }) => display_name)
        )
      )

      return lmServicesWithoutKeys
    }
  }
  return null
}
