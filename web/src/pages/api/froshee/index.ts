import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../utils/api/supabaseAdmin';
import { uuid } from '@supabase/gotrue-js/dist/main/lib/helpers';
import { PaymentType, Role } from 'prisma/types';

type FrosheeCreate = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  froshId: string;
  teamId: string;
  paymentAmount: string;
  universityId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') throw new Error('Unsupported request');

    const froshee = req.body as FrosheeCreate;

    const paymentId = uuid();

    const { error: paymentCreateError } = await supabaseAdmin
      .from('payment')
      .insert({
        id: paymentId,
        amount: Number(froshee.paymentAmount),
        type: PaymentType.Cash,
        stripePaymentIntentId: null,
      });

    if (paymentCreateError) throw paymentCreateError;

    const { error: frosheeCreateError } = await supabaseAdmin
      .auth
      .admin
      .createUser({
        email: froshee.email,
        email_confirm: true,
        user_metadata: {
          firstName: froshee.firstName,
          lastName: froshee.lastName,
          phoneNumber: froshee.phoneNumber === '' ? null : froshee.phoneNumber,
          role: Role.Froshee,
          universityId: froshee.universityId,
          froshId: froshee.froshId,
          teamId: froshee.teamId,
          paymentId,
        },
      });

    if (frosheeCreateError) throw frosheeCreateError;

    res.status(200).json({ error: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
