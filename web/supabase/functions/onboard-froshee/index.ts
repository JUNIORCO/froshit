// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { cryptoProvider, stripe } from '../_utils/stripe.ts';
import { getAdminSupabase } from '../_utils/supabaseAdmin.ts';
import { v4 as uuid } from '../_utils/uuid.ts';

const groupBy = (xs: any[], key: any) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

const createTeam = async ({ supabaseAdmin, newTeamNumber, froshId }: any): Promise<string | null> => {
  const newTeamId = uuid();

  const { error: teamCreateError } = await supabaseAdmin
    .from('team')
    .insert({
      id: newTeamId,
      number: newTeamNumber,
      name: `Team ${newTeamNumber}`,
      froshId,
    });

  if (teamCreateError) {
    console.log(`[Onboard Froshee] Auto assign team: encountered team create error ${teamCreateError.message}`);
    return null;
  }

  console.log(`[Onboard Froshee] Auto assign team: successfully created team ${newTeamNumber} with id ${newTeamId}`);
  return newTeamId;
};

const autoAssignTeam = async ({ supabaseAdmin, universityId, froshId }: any): Promise<string | null> => {
  const { data: university, error: universityError } = await supabaseAdmin
    .from('university')
    .select('maxTeamCapacity')
    .match({ id: universityId })
    .single();

  if (!university || universityError) return null;

  const { maxTeamCapacity } = university;

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profile')
    .select('*, team(*)')
    .match({
      role: 'Froshee',
      froshId,
    })
    .not('teamId', 'is', 'null');

  if (!profiles || profilesError) {
    console.log(`[Onboard Froshee] Auto assign team: encountered error ${profilesError.message}`);
    return null;
  }

  if (!profiles.length) {
    console.log(`[Onboard Froshee] Auto assign team: No profiles found, creating first team`);
    return createTeam({
      supabaseAdmin,
      newTeamNumber: 1,
      froshId,
    });
  }

  const groupedProfiles = groupBy(profiles, 'teamId');

  const [teamIdFound] = Object.entries(groupedProfiles)
    .find(([_, profiles]) => profiles.length < maxTeamCapacity) || [];

  // if a frosh with capacity exists, return it
  if (teamIdFound) {
    console.log(`[Onboard Froshee] Auto assign team: found ${teamIdFound} with capacity`);
    return teamIdFound;
  }

  const newTeamNumber = String(Object.values(groupedProfiles).length + 1);
  console.log(`[Onboard Froshee] Auto assign team: found no team with capacity, creating Team ${newTeamNumber}`);

  // otherwise create one
  return createTeam({
    supabaseAdmin,
    newTeamNumber,
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
  console.log(session.metadata)
  const { data: { user: authFroshee }, error: frosheeCreateError } = await supabaseAdmin
    .auth
    .admin
    .createUser({
      email: session.client_reference_id,
      email_confirm: true,
      user_metadata: {
        firstName: session.metadata.firstName,
        lastName: session.metadata.lastName,
        phoneNumber: session.metadata.phoneNumber === '' ? null : session.metadata.phoneNumber,
        role: 'Froshee',
        program: session.metadata.program,
        faculty: session.metadata.faculty,
        interests: session.metadata.interests,
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
        console.log('[Onboard Froshee] Handling checkout.session.completed');
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      default:
        console.log(`[Onboard Froshee] Unhandled event type ${event.type}`);
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
