import type { NextApiRequest, NextApiResponse } from 'next';
import { Role } from 'prisma/types';
import { supabaseAdmin } from '../_utils/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { email, firstName, lastName, phoneNumber, role, universityId, redirectTo } = req.body;

      // use the inviteUserByEmail api
      if (role === Role.Organizer) {
        const {
          data: user,
          error,
        } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
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
        const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
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

      const { data: user, error } = await supabaseAdmin.auth.admin.deleteUser(id);
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
