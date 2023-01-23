import { supabaseAdmin } from './_utils/supabaseAdmin.js';
import prompt from 'prompt';
import { Role } from 'prisma/types.js';

type TestUser = { email: string; firstName: string; lastName: string; phoneNumber: string };

const data: TestUser[] = [
  {
    'email': 'dui@hotmail.edu',
    'firstName': 'August',
    'lastName': 'Ferrell',
    'phoneNumber': '1-247-986-6884',
  },
  {
    'email': 'aliquam.adipiscing@protonmail.ca',
    'firstName': 'Grady',
    'lastName': 'Cooper',
    'phoneNumber': '(737) 955-7222',
  },
  {
    'email': 'sit.amet@google.edu',
    'firstName': 'Sandra',
    'lastName': 'George',
    'phoneNumber': '1-422-813-2544',
  },
  {
    'email': 'et.pede@google.com',
    'firstName': 'Zenia',
    'lastName': 'Byrd',
    'phoneNumber': '1-906-882-1172',
  },
  {
    'email': 'arcu.sed.eu@protonmail.edu',
    'firstName': 'Xyla',
    'lastName': 'Mcleod',
    'phoneNumber': '1-864-527-4935',
  },
];

async function main() {
  prompt.start();

  const { universityId } = await prompt.get(['universityId']);

  // get froshs
  const { data: froshs, error: getFroshsError } = await supabaseAdmin
    .from('frosh')
    .select('id')
    .match({ universityId });

  if (getFroshsError) throw getFroshsError;
  if (!froshs.length) throw new Error('No froshs found for that university id');

  const froshIds: string[] = froshs.map(frosh => frosh.id);

  console.log('froshIds: ', froshIds);

  // get teams
  const { data: teams, error: getTeamsError } = await supabaseAdmin
    .from('team')
    .select('id, froshId')
    .in('froshId', froshIds);

  if (getTeamsError) throw getFroshsError;
  if (!teams.length) throw new Error('No teams found for the frosh ids');

  console.log('teamIds: ', teams);

  // create users
  function getRandomTeamAndFrosh(teams: ({ id: any } & { froshId: any })[]): { id: any } & { froshId: any } {
    return teams[Math.floor((Math.random() * teams.length))];
  }

  for (const user of data) {
    const { id: teamId, froshId } = getRandomTeamAndFrosh(teams);
    const { error: userCreateError } = await supabaseAdmin
      .auth
      .admin
      .createUser({
        email: user.email,
        email_confirm: true,
        user_metadata: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber === '' ? null : user.phoneNumber,
          role: Role.Froshee,
          universityId,
          froshId,
          teamId,
          paymentId: null,
          program: 'Test program',
          faculty: 'Test faculty',
          interests: null,
        },
      });

    if (userCreateError) throw userCreateError;
  }
}

void main();
