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

      const resource = req.body as Prisma.ResourceUpdateInput;

      const updatedResource = await prisma.resource.update({ where: { id }, data: resource });

      res.status(200).json(updatedResource);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
