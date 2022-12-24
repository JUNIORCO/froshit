import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Role } from 'prisma/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { email, firstName, lastName, phoneNumber, role, universityId, redirectTo } = req.body;

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? '',
      );

      // use the inviteUserByEmail api
      if (role === Role.Organizer) {
        const {
          data: user,
          error,
        } = await supabase.auth.admin.inviteUserByEmail(email, {
          redirectTo,
          data: {
            firstName,
            lastName,
            phoneNumber,
            role,
            universityId,
          },
        });

        if (error) {
          throw error;
        }

        return res.status(200).json(user);
      }

      if (role === Role.Leader) {
        const { data: user, error } = await supabase.auth.admin.createUser({
          email,
          data: {
            firstName,
            lastName,
            phoneNumber,
            role,
            universityId,
          },
        });

        if (error) {
          throw error;
        }

        return res.status(200).json(user);
      }

      res.status(400).end('Unsupported user request');
    } else if (req.method === 'DELETE') {
      const { id } = req.body;

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? '',
      );

      const { data: user, error } = await supabase.auth.admin.deleteUser(id);
      if (error) {
        throw error;
      }

      res.status(200).json(user);
    } else {
      res.status(400).end('Unsupported request');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
}
