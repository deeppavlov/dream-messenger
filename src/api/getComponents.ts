import { TComponents } from 'types/types'
import { api } from 'api/axiosConfig'

export const getComponents = async (distName: string): Promise<TComponents> => {
  try {
    const { data } = await api.get(`assistant_dists/${distName}/components`)
    return data
  } catch (e) {
    throw e
  }
}
