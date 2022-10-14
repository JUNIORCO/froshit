import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma, PrismaType } from '../../../../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const profile = req.body as PrismaType.ProfileCreateInput;
      const user = await prisma.profile.create({ data: profile });
      res.status(200).json(user);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
