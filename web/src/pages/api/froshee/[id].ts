import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import type { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query  as any;
      const profile = req.body as Prisma.ProfileUpdateInput;

      const user = await prisma.profile.update({ where: { id }, data: profile });

      res.status(200).json(user);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
