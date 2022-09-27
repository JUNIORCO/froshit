import { prisma } from './prisma'

async function main() {
  // Create universities
  await prisma.university.createMany({
    data: [
      { name: 'McGill Univeristy', subdomain: 'mcgill' },
      { name: 'Concordia University', subdomain: 'concordia' },
      { name: 'University of Toronto', subdomain: 'uoft' },
    ],
  })

  // Create froshs
  await prisma.frosh.createMany({
    data: [
      { name: 'Engineering Frosh', description: 'Welcome to McGill Engineering Frosh', universityId: 1 },
      { name: 'Arts Frosh', description: 'Welcome to Concordia Arts Frosh', universityId: 2 },
      { name: 'Science Frosh', description: 'Welcome to UofT Science Frosh', universityId: 3 },
    ],
  })

  // create users
  await prisma.user.createMany({
    data: [
      // admins
      { name: 'Sami Junior', role: 'ADMIN', universityId: 1, froshId: null },
      { name: 'Peggy Philips', role: 'ADMIN', universityId: 2, froshId: null },
      { name: 'Alexa Macintosh', role: 'ADMIN', universityId: 3, froshId: null },
      // organizers
      { name: 'Ryan Blue', role: 'ORGANIZER', universityId: 1, froshId: null },
      { name: 'Andy Pac', role: 'ORGANIZER', universityId: 2, froshId: null },
      { name: 'Ben Parker', role: 'ORGANIZER', universityId: 3, froshId: null },
      // leaders
      { name: 'Abi Miller', role: 'LEADER', universityId: 1, froshId: 1 },
      { name: 'Tom Jones', role: 'LEADER', universityId: 2, froshId: 2 },
      { name: 'Pete Armani', role: 'LEADER', universityId: 3, froshId: 3 },
      // froshees
      { name: 'John Doe', role: 'FROSHEE', universityId: 1, froshId: 1 },
      { name: 'Amanda Reed', role: 'FROSHEE', universityId: 2, froshId: 2 },
      { name: 'Ava Gabriel', role: 'FROSHEE', universityId: 3, froshId: 3 },
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
