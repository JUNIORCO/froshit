// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../_utils/supabaseClient.ts';
import { FroshPayload, OnboardUniversitySchema } from './types.ts';
import { stripe } from '../_utils/stripe.ts';
import { v4 as uuid } from '../_utils/uuid.ts';
import async from '../_utils/async.ts';

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
    const { university, froshs, admin } = OnboardUniversitySchema.parse(body);

    // create the university in Supabase
    const { data: dbUniversity, error: universityCreateError } = await supabaseClient
      .from('university')
      .insert({
        id: uuid(),
        ...university,
      });

    if (universityCreateError) throw universityCreateError;

    // create the admin in supabase
    const { error: authUserCreateError } = await supabaseClient
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
            universityId: dbUniversity.id,
          },
        },
      });

    if (authUserCreateError) throw authUserCreateError;

    // create the froshs in Supabase and in Stripe
    const createFroshInSupabaseAndStripe = async (frosh: FroshPayload) => {
      const stripeCreatedPrice = stripe.prices.create({
        currency: 'cad',
        unit_amount: frosh.price, // in cents
        nickname: `Price of ${frosh.name}`,
        metadata: frosh,
        product_data: {
          name: frosh.name,
          metadata: frosh,
        },
      });

      const { error: createDbFroshError } = await supabaseClient
        .from('frosh')
        .insert({
          id: uuid(),
          name: frosh.name,
          description: frosh.description,
          stripeProductId: stripeCreatedPrice.product,
          stripePriceId: stripeCreatedPrice.id,
          price: stripeCreatedPrice.unit_amount,
          universityId: dbUniversity.id,
        });

      if (createDbFroshError) throw createDbFroshError;
    };

    const handleCreateFroshInSupabaseAndStripeError = (error) => {
      if (error) throw error;
    };

    async.eachSeries(froshs, createFroshInSupabaseAndStripe, handleCreateFroshInSupabaseAndStripeError);

    // create the bucket for the university
    const { error: bucketCreateError } = await supabaseClient
      .storage
      .createBucket(university.subdomain, { public: true });

    if (bucketCreateError) throw error;

    return new Response('Success!', {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/create-froshee' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"World"}'
