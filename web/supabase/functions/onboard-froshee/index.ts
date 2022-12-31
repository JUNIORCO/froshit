// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { stripe, cryptoProvider } from '../_utils/stripe.ts';
import { getAdminSupabase } from '../_utils/supabaseAdmin.ts';

const handleCheckoutSessionCompleted = async (session: any) => {
  const supabaseAdmin = getAdminSupabase();

  const { data: { user: authFroshee }, error: frosheeCreateError } = await supabaseAdmin
    .auth
    .admin
    .createUser({
      email: session.client_reference_id,
      email_confirm: true,
      user_metadata: {
        firstName: session.metadata.firstName,
        lastName: session.metadata.lastName,
        phoneNumber: session.metadata.phoneNumber,
        role: 'Froshee',
        universityId: session.metadata.universityId,
      },
    });

  if (!authFroshee || frosheeCreateError) throw frosheeCreateError;

  const { error: updateError } = await supabaseAdmin
    .from('profile')
    .update({
      froshId: session.metadata.froshId,
      paymentId: session.payment_intent,
    })
    .match({ id: authFroshee.id });

  if (updateError) throw updateError;
};

/**
 * This endpoint is hit by Stripe
 */
serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Unsupported method' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const body = await req.text();
    const stripeSignature = req.headers.get('Stripe-Signature');
    const stripeSecretKey = Deno.env.get('STRIPE_ONBOARD_FROSHEE_SECRET');

    if (!stripeSignature || !stripeSecretKey) throw new Error('No key found');

    const event = await stripe.webhooks.constructEventAsync(
      body,
      stripeSignature,
      stripeSecretKey,
      undefined,
      cryptoProvider
    );

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('handling checkout.session.completed')
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return new Response(JSON.stringify({ error: null }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
