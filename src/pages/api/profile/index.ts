import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const profile = req.body as Prisma.ProfileCreateInput;

      const user = await prisma.profile.create({ data: profile });

      res.status(200).json(user);
    }

    res.status(400).end('Unsupported request');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
