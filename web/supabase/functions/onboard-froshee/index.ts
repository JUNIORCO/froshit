// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { cryptoProvider, stripe } from '../_utils/stripe.ts';
import { getAdminSupabase } from '../_utils/supabaseAdmin.ts';
import { v4 as uuid } from '../_utils/uuid.ts';

const groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const createTeam = async ({ supabaseAdmin, newTeamId, newTeamNumber, froshId }): Promise<string | null> => {
  const { error: teamCreateError } = await supabaseAdmin
    .from('team')
    .insert({
      id: newTeamId,
      number: newTeamNumber,
      name: `Team ${newTeamNumber}`,
      froshId,
    });

  return teamCreateError ? null : newTeamId;
};

const autoAssignTeam = async ({ supabaseAdmin, universityId, froshId }): Promise<string | null> => {
  const { data: university, error: universityError } = await supabaseAdmin
    .from('university')
    .select('maxTeamCapacity')
    .match({ id: universityId })
    .single();
  console.log('Found university ', university, universityError);
  if (!university || universityError) return null;

  const { maxTeamCapacity } = university;

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profile')
    .select('*, team(*)')
    .match({ froshId });

  console.log('Found profiles ', profiles, profilesError);

  if (!profiles || profilesError) return null;

  if (!profiles.length) {
    return createTeam({
      supabaseAdmin,
      newTeamId: uuid(),
      newTeamNumber: 1,
      froshId,
    });
  }

  const groupedProfiles = groupBy(profiles, 'teamId');

  console.log('groupedProfiles ', groupedProfiles);

  const [froshIdFound] = Object.entries(groupedProfiles)
    .find(([_, profiles]) => profiles.length < maxTeamCapacity) || [];

  console.log('froshIdFound ', froshIdFound);

  // if a frosh with capacity exists, return it
  if (froshIdFound) return froshIdFound;

  // otherwise create one
  return createTeam({
    supabaseAdmin,
    newTeamId: uuid(),
    newTeamNumber: String(Object.values(groupedProfiles).length + 1),
    froshId,
  });

};

const handleCheckoutSessionCompleted = async (session: any) => {
  const supabaseAdmin = getAdminSupabase();

  console.log(`[Onboard Froshee] Starting handler for email ${session.client_reference_id} and payment intent id ${session.payment_intent}`);

  const paymentId = uuid();
  const { error: createPaymentError } = await supabaseAdmin
    .from('payment')
    .insert({
      id: paymentId,
      amount: session.amount_total,
      type: 'Online',
      stripePaymentIntentId: session.payment_intent,
    });

  if (createPaymentError) throw createPaymentError;

  console.log(`[Onboard Froshee] Created payment in Supabase ${paymentId} for email ${session.client_reference_id}`);

  const teamId = await autoAssignTeam({
    supabaseAdmin,
    universityId: session.metadata.universityId,
    froshId: session.metadata.froshId,
  });

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
        froshId: session.metadata.froshId,
        teamId,
        paymentId,
      },
    });

  if (!authFroshee || frosheeCreateError) throw frosheeCreateError;

  console.log(`[Onboard Froshee] Created auth user ${authFroshee.id} for email ${session.client_reference_id}`);
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

    if (!stripeSignature) throw new Error('No Stripe signature found');
    if (!stripeSecretKey) throw new Error('No Stripe secret key found');

    const event = await stripe.webhooks.constructEventAsync(
      body,
      stripeSignature,
      stripeSecretKey,
      undefined,
      cryptoProvider,
    );

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('handling checkout.session.completed');
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
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
