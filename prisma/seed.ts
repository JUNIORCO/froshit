import { prisma } from './prisma'

async function main() {
  // Create universities
  await prisma.university.createMany({
    data: [
      { name: 'McGill Univeristy', subdomain: 'mcgill', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x' },
      { name: 'Concordia University', subdomain: 'concordia', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x' },
      { name: 'University of Toronto', subdomain: 'uoft', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x' },
    ],
  })

  // Create froshs
  await prisma.frosh.createMany({
    data: [
      { name: 'Engineering Frosh', description: 'Welcome to McGill Engineering Frosh', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', universityId: 1 },
      { name: 'Arts Frosh', description: 'Welcome to Concordia Arts Frosh', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', universityId: 2 },
      { name: 'Science Frosh', description: 'Welcome to UofT Science Frosh', imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', universityId: 3 },
    ],
  })

  // Create events
  await prisma.event.createMany({
    data: [
      { name: 'Concert', description: 'Some description about the concert', 'startDate': new Date('September 1, 2023 15:00:00'), endDate: new Date('September 1, 2023 18:00:00'), imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', location: 'Some location', accessibility: 'Some accessibility text', froshId: 1 },
      { name: 'Bar Hop', description: 'Some description about the bar hop', 'startDate': new Date('September 1, 2023 15:00:00'), endDate: new Date('September 1, 2023 18:00:00'), imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', location: 'Some location', accessibility: 'Some accessibility text', froshId: 2 },
      { name: 'Party', description: 'Some description about the party', 'startDate': new Date('September 1, 2023 15:00:00'), endDate: new Date('September 1, 2023 18:00:00'), imageUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', location: 'Some location', accessibility: 'Some accessibility text', froshId: 3 },
    ],
  });

  // Create teams
  await prisma.team.createMany({
    data: [
      { name: 'Team 1', froshId: 1 },
      { name: 'Team 2', froshId: 2 },
      { name: 'Team 3', froshId: 3 }
    ],
  });

  // Create users
  await prisma.profile.createMany({
    data: [
      // admins
      { name: 'Sami Junior', email: 'sami.junior@example.com', phoneNumber: '4385225656', role: 'Admin', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null, universityId: 1, froshId: null, teamId: null },
      { name: 'Peggy Philips', email: 'peggy.philips@example.com', phoneNumber: '4385225656',role: 'Admin', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null,universityId: 2, froshId: null, teamId: null },
      { name: 'Alexa Macintosh', email: 'alexa.macintosh@example.com', phoneNumber: '4385225656',role: 'Admin', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null,universityId: 3, froshId: null, teamId: null },
      // organizers
      { name: 'Ryan Blue', email: 'ryan.blue@example.com', phoneNumber: '4385225656',role: 'Organizer', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null, universityId: 1, froshId: null, teamId: null },
      { name: 'Andy Pac', email: 'andy.pac@example.com', phoneNumber: '4385225656',role: 'Organizer', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null, universityId: 2, froshId: null, teamId: null },
      { name: 'Ben Parker', email: 'ben.parker@example.com', phoneNumber: '4385225656',role: 'Organizer', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: null, interests: null, universityId: 3, froshId: null, teamId: null },
      // leaders
      { name: 'Abi Miller', email: 'abi.miller@example.com', phoneNumber: '4385225656',role: 'Leader', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Arts', interests: 'Snowboarding',universityId: 1, froshId: 1, teamId: 1 },
      { name: 'Tom Jones', email: 'tom.jones@example.com', phoneNumber: '4385225656',role: 'Leader', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Science', interests: 'Basketball',universityId: 2, froshId: 2, teamId: 2 },
      { name: 'Pete Armani', email: 'pete.armani@example.com', phoneNumber: '4385225656',role: 'Leader', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Engineering', interests: 'Ski',universityId: 3, froshId: 3, teamId: 3 },
      // froshees
      { name: 'John Doe', email: 'john.doe@example.com', phoneNumber: '4385225656',role: 'Froshee', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Engineering', interests: 'Cricket',universityId: 1, froshId: 1, teamId: 1 },
      { name: 'Amanda Reed', email: 'amanda.reed@example.com', phoneNumber: '4385225656',role: 'Froshee', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Arts', interests: 'Football',universityId: 2, froshId: 2, teamId: 2 },
      { name: 'Ava Gabriel', email: 'ava.gabriel@example.com', phoneNumber: '4385225656',role: 'Froshee', avatarUrl: 'https://gravatar.com/avatar/797edb6dfb170ce5952723c711d3bf09?s=400&d=robohash&r=x', program: 'Science', interests: 'Swimming', universityId: 3, froshId: 3, teamId: 3 },
    ],
  })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
