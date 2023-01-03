import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import dayjs from 'src/utils/dayjs';

type RequestBody = {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  accessibility: string;
  froshIds: string[];
}

/**
 * Create an event and assign to many Froshs
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') throw new Error('Unsupported request');

    const { froshIds, ...event } = req.body as RequestBody;

    const formattedFroshIds: { id: string }[] = froshIds.map(froshId => ({ id: froshId }));

    const createdEvent = await prisma.event.create({
      data: {
        ...event,
        froshs: {
          connect: formattedFroshIds,
        },
      },
    });

    res.status(200).json({ data: createdEvent, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: null, error: error.message });
  }
}
