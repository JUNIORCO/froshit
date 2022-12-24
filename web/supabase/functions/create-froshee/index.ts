// @ts-nocheck

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

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
    const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.createUser({
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
    //
    // if (authUserError) {
    //   throw authUserError;
    // }
    //
    // const { data: selectedFrosh } = await supabaseClient.from('frosh').select('*').match({
    //   name: froshName,
    //   universityId,
    // });
    // console.log('selectedFrosh : ', selectedFrosh);
    // const { error: userProfile } = await supabaseClient.from('profile').update({ froshId: selectedFrosh.id }).match({ id: authUser.id });
    // console.log('userProfile : ', userProfile);

    return new Response(JSON.stringify({ userProfile: '' }), {
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
