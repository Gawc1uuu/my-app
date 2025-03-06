# my-app

first of all in folders fe and be you need to create .env file with the following content:
fe: 
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_SERVICE_KEY=
be:
DATABASE_URL=postgresql://postgres:password@localhost:4321/test
SUPABASE_SERVICE_ROLE_KEY=

i added .env.example to both of them so you can have an example of how it should look like



to run frontend follow this steps:
1. cd fe
2. pnpm install
3. pnpm run dev



steps to run backend:
1. cd be
2. pnpm install
3. run docker desktop
4. pnpm run db:up
5. pnpm run migrate
6. pnpm run dev 