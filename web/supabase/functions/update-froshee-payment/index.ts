// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

/**
 * Zapier hits this endpoint when a Froshee completes a Stripe payment
 */
serve(async (req: Request) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Unsupported method' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const body = await req.json();
    const { email, firstName, lastName, froshName, phoneNumber, universityId } = body;
    console.log('req body : ', body);
    const { data: { user: authUser }, error: authUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        phoneNumber,
        role: 'Froshee',
        universityId,
      },
    });
    console.log('authUser : ', authUser);

    if (authUserError) {
      throw authUserError;
    }

    const { data: selectedFrosh, error: selectedFroshError } = await supabaseClient.from('frosh').select('*').match({
      name: froshName,
      universityId,
    }).single();
    console.log('selectedFrosh & error : ', selectedFrosh, selectedFroshError)
    if (selectedFrosh && !selectedFroshError) {
      const { error: updateError } = await supabaseClient
        .from('profile')
        .update({ froshId: selectedFrosh.id })
        .match({ id: authUser.id });
      console.log('updateError : ', updateError)
    }

    return new Response('success', {
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
