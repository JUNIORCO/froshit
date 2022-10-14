import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma, PrismaType } from '../../../../prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query;

      if (!id) {
        throw new Error('No id found');
      }

      const profile = req.body as PrismaType.ProfileUpdateInput;
      const user = await prisma.profile.update({ where: { id: +id }, data: profile });
      res.status(200).json(user);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
