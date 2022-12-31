import { NextApiRequest, NextApiResponse } from 'next';
import { Frosh, University } from 'prisma/types';
import { stripe } from '../_utils/stripe';
import { PATH_FROSHEE_REGISTER } from '../../../routes/paths';
import { FormRegisterProps } from '../../../contexts/FrosheeRegistrationContext';

type CreateCheckoutBody = {
  formPayload: FormRegisterProps;
  university: University & { froshs: Frosh[] };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end('Method Not Allowed');
    }

    const { formPayload, university }: CreateCheckoutBody = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: formPayload.frosh!.stripePriceId,
          quantity: 1,
        },
      ],
      currency: 'cad',
      mode: 'payment',
      success_url: `${req.headers.origin}${PATH_FROSHEE_REGISTER.success}`,
      cancel_url: `${req.headers.origin}${PATH_FROSHEE_REGISTER.register}`,
      // automatic_tax: { enabled: true }, TODO turn on
      client_reference_id: formPayload.email,
      metadata: {
        firstName: formPayload.firstName,
        lastName: formPayload.lastName,
        email: formPayload.email,
        phoneNumber: formPayload.phoneNumber,
        froshId: formPayload.frosh!.id,
        universityId: university.id,
        universityStripeConnectedAccountId: university.stripeConnectedAccountId,
      },
      payment_intent_data: {
        application_fee_amount: 1,
        transfer_data: {
          destination: university.stripeConnectedAccountId,
        },
      },
      custom_text: {
        submit: { message: `Review your university email before paying: ${formPayload.email}` }
      }
    });

    res.status(303).json({ session, error: null });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ session: null, error: error.message });
  }
};
