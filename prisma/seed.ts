import { prisma } from './prisma';

async function main() {
  // Create universities
  await prisma.university.createMany({
    data: [
      {
        name: 'Demo University',
        subdomain: 'demo',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
      },
      {
        name: 'McGill Univeristy',
        subdomain: 'mcgill',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
      },
      {
        name: 'Concordia University',
        subdomain: 'concordia',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
      },
      {
        name: 'University of Toronto',
        subdomain: 'uoft',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
      },
    ],
  });

  // Create programs
  await prisma.program.createMany({
    data: [
      { name: 'Software Engineering', universityId: 1 },
      { name: 'History', universityId: 1 },
      { name: 'Drama', universityId: 1 },
      { name: 'Mechanical Engineering', universityId: 2 },
      { name: 'Science', universityId: 2 },
      { name: 'Art', universityId: 2 },
    ],
  });

  // Create froshs
  await prisma.frosh.createMany({
    data: [
      {
        name: 'Engineering Frosh',
        description: 'Welcome to McGill Engineering Frosh',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        universityId: 1,
      },
      {
        name: 'Arts Frosh',
        description: 'Welcome to Concordia Arts Frosh',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        universityId: 2,
      },
      {
        name: 'Science Frosh',
        description: 'Welcome to UofT Science Frosh',
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        universityId: 3,
      },
    ],
  });

  // Create events
  await prisma.event.createMany({
    data: [
      {
        name: 'Concert',
        description: 'Some description about the concert',
        'startDate': new Date('September 1, 2023 15:00:00'),
        endDate: new Date('September 1, 2023 18:00:00'),
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        location: 'Some location',
        accessibility: 'Some accessibility text',
        froshId: 1,
      },
      {
        name: 'Bar Hop',
        description: 'Some description about the bar hop',
        'startDate': new Date('September 1, 2023 15:00:00'),
        endDate: new Date('September 1, 2023 18:00:00'),
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        location: 'Some location',
        accessibility: 'Some accessibility text',
        froshId: 2,
      },
      {
        name: 'Party',
        description: 'Some description about the party',
        'startDate': new Date('September 1, 2023 15:00:00'),
        endDate: new Date('September 1, 2023 18:00:00'),
        imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        location: 'Some location',
        accessibility: 'Some accessibility text',
        froshId: 3,
      },
    ],
  });

  // Create team
  await prisma.team.createMany({
    data: [
      { name: 'FC Barcelona', froshId: 1 },
      { name: 'Real Madrid', froshId: 2 },
      { name: 'Chelsea', froshId: 3 },
      { name: 'Arsenal', froshId: 3 },
    ],
  });

  // Create user
  await prisma.profile.createMany({
    data: [
      // admins
      {
        name: 'Sami Junior',
        email: 'sami.junior@example.com',
        phoneNumber: '1234567898',
        role: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Travel'],
        universityId: 1,
        programId: 1,
        froshId: null,
        teamId: null,
      },
      {
        name: 'Peggy Philips',
        email: 'peggy.philips@example.com',
        phoneNumber: '1234567899',
        role: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Outdoors'],
        universityId: 2,
        programId: 1,
        froshId: null,
        teamId: null,
      },
      {
        name: 'Alexa Macintosh',
        email: 'alexa.macintosh@example.com',
        phoneNumber: '1234567891',
        role: 'Admin',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Sports'],
        universityId: 3,
        programId: 1,
        froshId: null,
        teamId: null,
      },
      // organizers
      {
        name: 'Ryan Blue',
        email: 'ryan.blue@example.com',
        phoneNumber: '1234567892',
        role: 'Organizer',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Pizza'],
        universityId: 1,
        programId: 1,
        froshId: null,
        teamId: null,
      },
      {
        name: 'Andy Pac',
        email: 'andy.pac@example.com',
        phoneNumber: '1234567893',
        role: 'Organizer',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Netflix'],
        universityId: 2,
        programId: 2,
        froshId: null,
        teamId: null,
      },
      {
        name: 'Ben Parker',
        email: 'ben.parker@example.com',
        phoneNumber: '1234567894',
        role: 'Organizer',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 1,
        programId: 2,
        froshId: null,
        teamId: null,
      },
      // leaders
      {
        name: 'Abi Miller',
        email: 'abi.miller@example.com',
        phoneNumber: '1234567895',
        role: 'Leader',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 1,
        programId: 2,
        froshId: 1,
        teamId: 1,
      },
      {
        name: 'Tom Jones',
        email: 'tom.jones@example.com',
        phoneNumber: '1234567896',
        role: 'Leader',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 2,
        programId: 3,
        froshId: 2,
        teamId: 2,
      },
      {
        name: 'Pete Armani',
        email: 'pete.armani@example.com',
        phoneNumber: '1234567897',
        role: 'Leader',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 3,
        programId: 3,
        froshId: 3,
        teamId: 3,
      },
      // froshees
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '9876543211',
        role: 'Froshee',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 1,
        programId: 2,
        froshId: 1,
        teamId: 1,
      },
      {
        name: 'Amanda Reed',
        email: 'amanda.reed@example.com',
        phoneNumber: '9876543212',
        role: 'Froshee',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies', 'Netflix'],
        universityId: 2,
        programId: 2,
        froshId: 2,
        teamId: 2,
      },
      {
        name: 'Ava Gabriel',
        email: 'ava.gabriel@example.com',
        phoneNumber: '9876543213',
        role: 'Froshee',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: 150,
        interests: ['Movies', 'Netflix'],
        universityId: 3,
        programId: 3,
        froshId: 3,
        teamId: 3,
      },
      {
        name: 'Chanel Geoffery',
        email: 'chanel.Geoffery@example.com',
        phoneNumber: '12334445',
        role: 'Froshee',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: 100,
        interests: ['Movies', 'Netflix'],
        universityId: 3,
        programId: 3,
        froshId: 3,
        teamId: 1,
      },
      {
        name: 'Luca Van',
        email: 'luca.van@example.com',
        phoneNumber: '1114449857',
        role: 'Leader',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Netflix'],
        universityId: 3,
        programId: 3,
        froshId: 3,
        teamId: 1,
      },
      {
        name: 'No Team',
        email: 'no.team@example.com',
        phoneNumber: '1114449827',
        role: 'Froshee',
        avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x',
        paid: null,
        interests: ['Movies'],
        universityId: 3,
        programId: 3,
        froshId: 3,
        teamId: null,
      },
    ],
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
