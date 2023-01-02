import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';

type RequestBody = {
  id: string;
  imageUrl?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  accessibility: string;
  froshIds: string[];
}

/**
 * Edit an event and assign/unassign to many Froshs
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'PATCH') throw new Error('Unsupported request');

    const { id } = req.query as { id: string };
    const { froshIds, ...event } = req.body as RequestBody;

    const currentEvent = await prisma.event.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        froshs: true,
      },
    });

    const idsToDisconnect: { id: string }[] = currentEvent.froshs.map(({ id }) => ({ id }));
    const formattedFroshIds: { id: string }[] = froshIds.map(froshId => ({ id: froshId }));

    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...event,
        froshs: {
          disconnect: idsToDisconnect,
          connect: formattedFroshIds,
        },
      },
    });

    res.status(200).json({ data: updatedEvent, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: null, error: error.message });
  }
}
