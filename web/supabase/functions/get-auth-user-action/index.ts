// @ts-nocheck
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

serve(async (req: Request) => {
  try {
    const { url, method } = req;

    const taskPattern = new URLPattern({ pathname: '/get-auth-user-action/:email' });
    const matchingPath = taskPattern.exec(url);
    const email = matchingPath ? matchingPath.pathname.groups.email : null;

    if (!(email && method === 'GET')) {
      return new Response(JSON.stringify({ error: 'INVALID_REQUEST' }), { status: 403 });
    }

    // check if profile exists
    const { data: dbProfile, error: profileError } = await supabaseClient
      .from(Tables.PROFILE)
      .select('*, university (id, subdomain)')
      .eq('email', email)
      .single() as any;

    if (!dbProfile || profileError) {
      return new Response(JSON.stringify({ error: 'PROFILE_NOT_FOUND' }));
    }

    // check if profile belongs to university
    if (dbProfile.university.id !== selectedUniversityId) {
      return new Response(JSON.stringify({ error: 'INVALID_UNIVERSITY_SELECTION' }));
    }

    // check if profile is froshee/leader
    if (!['Leader', 'Froshee'].includes(dbProfile.role)) {
      return new Response(JSON.stringify({ error: 'INVALID_ROLE' }));
    }

    const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserById(dbProfile.id);

    const isVerified = !!authUser.email_confirmed_at;

    if (!isVerified) {
      return new Response(JSON.stringify({ error: 'SET_PASSWORD' }));
    }

    const { data, error } = await supabaseClient.auth.api.createUser({
      email: 'user@email.com',
      password: 'password',
      user_metadata: { name: 'Yoda' },
    });

    return new Response(JSON.stringify({ data, error }), {
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
// curl -i --location --request POST 'http://localhost:54321/functions/v1/get-auth-user-action' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"World"}'
