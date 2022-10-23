import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import type { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query;

      if (!id) {
        throw new Error('No id found');
      }

      const { name, froshId } = req.body as Prisma.TeamUncheckedUpdateInput;
      const { profiles }: { profiles: number[] } = req.body;

      const currentTeam = await prisma.team.findUniqueOrThrow({
        where: {
          id: Number(id),
        },
        include: {
          profiles: true,
        },
      });

      const idsToDisconnect = currentTeam.profiles.map(({ id }) => ({ id }));
      const idsToConnect = profiles.map((profileId) => ({ id: profileId }));

      const user = await prisma.team.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          froshId,
          profiles: {
            disconnect: idsToDisconnect,
            connect: idsToConnect,
          },
        },
      });
      res.status(200).json(user);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
