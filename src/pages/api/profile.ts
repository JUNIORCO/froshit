import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma, PrismaType } from '../../../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('inside api/profile')
  console.log('api/profile -> body : ', req.body)
  const profile = req.body as PrismaType.ProfileCreateInput;
  try {
    const user = await prisma.profile.create({ data: profile });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
