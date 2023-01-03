// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { getAdminSupabase } from '../_utils/supabaseAdmin.ts';
import { OnboardPayload, OnboardUniversitySchema } from './types.ts';
import { stripe } from '../_utils/stripe.ts';
import { v4 as uuid } from '../_utils/uuid.ts';

/**
 * I hit this endpoint manually when onboarding a university
 */
serve(async (req: Request) => {
  console.log('[Onboard University] Function started')
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Unsupported method' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const { university, froshs, admin } = OnboardUniversitySchema.parse(body) as OnboardPayload;
    console.log('[Onboard University] Passed zod validation');

    const supabaseAdmin = getAdminSupabase();

    // create the university in Supabase
    const universityId = uuid();
    const { error: universityCreateError } = await supabaseAdmin
      .from('university')
      .insert({
        id: universityId,
        ...university,
      });

    if (universityCreateError) throw universityCreateError;

    console.log('[Onboard University] Created university');

    // create the admin in supabase
    const { error: authUserCreateError } = await supabaseAdmin
      .auth
      .signUp({
        email: admin.email,
        password: admin.password,
        options: {
          emailRedirectTo: `https://${university.subdomain}.froshit.com/auth/set-password`,
          data: {
            firstName: admin.firstName,
            lastName: admin.lastName,
            phoneNumber: admin.phoneNumber,
            role: 'Admin',
            universityId,
            froshId: null,
            teamId: null,
            paymentId: null,
          },
        },
      });

    if (authUserCreateError) throw authUserCreateError;

    console.log('[Onboard University] Created auth user');

    // create the froshs in Supabase and in Stripe
    for (const frosh of froshs) {
      const metadata = {
        ...frosh,
        university: university.name,
        universityId: university.id,
      };
      const stripeCreatedPrice = await stripe.prices.create({
        currency: 'cad',
        unit_amount: frosh.price,
        nickname: `Price of ${frosh.name} at ${university.name}`,
        metadata,
        product_data: {
          name: `${university.name} - ${frosh.name}`,
          metadata,
        },
      });

      console.log(`[Onboard University] Created frosh ${frosh.name} in Stripe`);

      const { error: createDbFroshError } = await supabaseAdmin
        .from('frosh')
        .insert({
          id: uuid(),
          name: frosh.name,
          description: frosh.description,
          stripeProductId: stripeCreatedPrice.product,
          stripePriceId: stripeCreatedPrice.id,
          price: stripeCreatedPrice.unit_amount,
          applicationFee: frosh.applicationFee,
          universityId,
        });

      if (createDbFroshError) throw createDbFroshError;

      console.log(`[Onboard University] Created frosh ${frosh.name} in Supabase`);
    }

    console.log('[Onboard University] Success!');

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
