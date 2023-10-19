import axios from 'axios'

const { MODE } = import.meta.env

export const api = axios.create({
  baseURL: import.meta.env['VITE_DIST_API_URL_' + MODE],
})
