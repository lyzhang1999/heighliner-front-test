/**
 * Handle http request
 */

import useSWR from 'swr'

const apiHost = '/api'

const fetcher = (url: string) => fetch(apiHost + url).then(r => r.json())

export interface ResponseInterface {
  data?: any,
  error?: any,
}

export function useApi(path: string): ResponseInterface {
  const { data, error } = useSWR(path, fetcher)
  return { data, error }
}
