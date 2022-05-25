import type { NextApiRequest, NextApiResponse } from 'next'
import { faker } from '@faker-js/faker';

interface LoginModel {
  token: string,
  user_id: number,
  user_name: string,
  avatar_url: string
}

interface ErrorModel {
  err_msg: string
}

export default function handler(
  req:  NextApiRequest,
  res: NextApiResponse<LoginModel | ErrorModel>
) {
  res.status(200).json({
    token: faker.datatype.string(20),
    user_id: faker.datatype.number({min: 10000, max: 999999999}),
    user_name: faker.name.findName(),
    avatar_url: faker.internet.url()
  })
}
