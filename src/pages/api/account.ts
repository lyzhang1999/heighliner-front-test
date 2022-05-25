/**
 * Account mock api
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { faker } from '@faker-js/faker';

interface AccountModel {
  name: string,
  email: string,
}

interface ErrorModel {
  error: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountModel | ErrorModel>,
) {
  // 401
  res.status(401).json({
    error: 'Not Authorized',
  })

  // 500
  // res.status(500).end()

  // Success response.
  // res.status(200).json({
  //   name: faker.name.findName(),
  //   email: faker.internet.email(),
  // })
}
