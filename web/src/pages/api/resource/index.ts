import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const resource = req.body as Prisma.ResourceUncheckedCreateInput;

      const createdResource = await prisma.resource.create({
        data: {
          ...resource,
          phoneNumber: resource.phoneNumber === '' ? null : resource.phoneNumber,
          email: resource.phoneNumber === '' ? null : resource.email,
        },
      });

      res.status(200).json(createdResource);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
