import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import type { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'PATCH') {
      const { id } = req.query as { id: string };

      const { name, number, froshId } = req.body as Prisma.TeamUncheckedUpdateInput;
      const { profiles }: { profiles: number[] } = req.body;

      const currentTeam = await prisma.team.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          profiles: true,
        },
      });

      const idsToDisconnect = currentTeam.profiles.map(({ id }) => ({ id }));
      const idsToConnect = profiles.map((profileId) => ({ id: profileId })) as any;

      const user = await prisma.team.update({
        where: {
          id,
        },
        data: {
          name,
          number,
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
    res.status(422).json({
      error: {
        message: error.message,
        code: error.code,
        meta: error.meta,
      },
    });
  }
}
