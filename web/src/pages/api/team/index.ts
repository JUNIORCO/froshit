import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma';
import { Prisma } from '../../../../prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { name, froshId } = req.body as Prisma.TeamUncheckedCreateInput;
      const { profiles }: { profiles: number[] } = req.body;
      const createdTeam = await prisma.team.create({
        data: {
          name,
          froshId,
          profiles: {
            connect: profiles.map((profileId) => ({ id: profileId })),
          },
        },
      });
      res.status(200).json(createdTeam);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
