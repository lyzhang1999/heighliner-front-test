/**
 * Data hooks
 */

import {useApi} from "@/utils/http";

export interface AccountInterface {
  name: string,
  email: string,
}

export function useAccount(userId: string): AccountInterface | null {
  const path = '/account'
  const {data, error} = useApi(path)
  if (error) {
    return null
  }
  return data
}
