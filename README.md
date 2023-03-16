# License
Copyright (C) FROSHIT Inc. - All Rights Reserved

Unauthorized copying of this file, via any medium is strictly prohibited.

Proprietary and confidential.

Written by Sami Junior Kahil <sami@froshit.com>.

# FROSHIT

This is the FROSHIT monolith repo. Contains the backend, frontend, and mobile application.

## Technologies Used

- Next.js – Web framework
- React Native - Mobile Framework
- Supabase – Database
- Prisma – ORM
- Typescript – Programming Language
- Vercel – Hosting

## Local Development

### Backend

In one terminal, start Supabase (make sure Docker is started):

```bash
npm run supabase:start
```

This will start an empty database instance with no tables or data based on your `.env` file.

To add our models to the database instance, use Prisma

```bash
npm run prisma:db-push
```

This will generate the tables and associations.
Open [http://localhost:54323/project/default/editor](http://localhost:54323/project/default/editor)
to see the results.

To seed the database, again use Prisma

```bash
npm run prisma:seed
```

You should now see testing data in the database.

To clear the Supabase instance (i.e delete all data and drop all tables), run

```bash
npm run supabase:reset
```

#### Emails

Inbucket URL `http://localhost:54324`

#### Functions

`supabase functions serve onboard-university --env-file ./supabase/.env.local`

`supabase functions serve onboard-froshee --env-file ./supabase/.env.local --no-verify-jwt`

`stripe listen --forward-to localhost:54321/functions/v1/onboard-froshee`

`stripe trigger checkout.session.completed`

### Frontend

Start another terminal and run

```bash
npm run next:dev
```

It will be running on [http://localhost:3000](http://localhost:3000)

### Web Deployment

Automatic deployment when you push to `main` branch. Make sure you verify the build before deploying!

```bash
npm run next:build
```

[Link to Vercel](https://vercel.com/juniorco/froshit)

## Mobile
### Expo Go Development

Will open the app in Expo Go, so you can debug on the downloaded Expo Go app on your phone or on a simulator.

```bash
expo start
```

### Testing Deployment

To invite a user, run `eas device:create`

`eas build --profile preview --platform all`

`npx expo prebuild -p ios && xed ios`


