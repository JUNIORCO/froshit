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
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Unsupported method' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const { university, froshs, admin } = OnboardUniversitySchema.parse(body) as OnboardPayload;

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
          },
        },
      });

    if (authUserCreateError) throw authUserCreateError;

    // create the froshs in Supabase and in Stripe
    for (const frosh of froshs) {
      const metadata = {
        ...frosh,
        university: university.name,
        universityId: university.id,
      };
      const stripeCreatedPrice = await stripe.prices.create({
        currency: 'cad',
        unit_amount: frosh.price, // in cents
        nickname: `Price of ${frosh.name} at ${university.name}`,
        metadata,
        product_data: {
          name: `${university.name} - ${frosh.name}`,
          metadata,
        },
      });

      const { error: createDbFroshError } = await supabaseAdmin
        .from('frosh')
        .insert({
          id: uuid(),
          name: frosh.name,
          description: frosh.description,
          stripeProductId: stripeCreatedPrice.product,
          stripePriceId: stripeCreatedPrice.id,
          price: stripeCreatedPrice.unit_amount,
          universityId,
        });

      if (createDbFroshError) throw createDbFroshError;
    }

    // create the bucket for the university
    const { error: bucketCreateError } = await supabaseAdmin
      .storage
      .createBucket(university.subdomain, { public: true });

    if (bucketCreateError) throw bucketCreateError;

    return new Response('Success!', {
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
