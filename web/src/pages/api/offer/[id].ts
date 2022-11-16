import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import type { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query as any;

      if (!id) {
        res.status(400).end('No id found');
      }

      const frosh = req.body as Prisma.FroshUpdateInput;

      const updatedFrosh = await prisma.frosh.update({ where: { id }, data: frosh });

      res.status(200).json(updatedFrosh);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
