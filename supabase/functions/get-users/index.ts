// @ts-nocheck
import { prisma } from '../../../prisma';
import type { Frosh, Profile, Team } from '../../../prisma/types';
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { supabaseClient } from '../_shared/supabaseClient.ts';

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

serve(async (req: Request) => {
  try {
    console.log('user function is called...')
    const users = prisma.profile.findMany({
      include: {
        frosh: true,
        team: true,
      },
    })

    console.log('user function users : ', users)

    return new Response(JSON.stringify({ data: users, error }), {
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
