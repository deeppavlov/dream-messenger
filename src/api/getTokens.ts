import { api } from 'api/axiosConfig'

export async function getTokens() {
  try {
    const { data } = await api.get('api_keys')
    return data
  } catch (e) {
    throw e
  }
}
