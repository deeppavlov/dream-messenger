import { api } from 'api/axiosConfig'

export async function getAssistant(dist_name: string) {
  try {
    const { data } = await api.get(`assistant_dists/${dist_name}`)
    return data
  } catch (e) {
    throw e
  }
}
