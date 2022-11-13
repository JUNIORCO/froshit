import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const offer = req.body as Prisma.OfferUncheckedCreateInput;

      console.log('creating offer : ', offer);

      const createdFrosh = await prisma.offer.create({ data: offer });

      res.status(200).json(createdFrosh);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
