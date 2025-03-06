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

I completed most of the tasks, but I’m aware that there are a lot of flaws. The project is still very much a demo—filters and pagination should be handled on the server rather than the client. I also chose React instead of Next.js because it was faster for prototyping. I took your advice and made a lot of shortcuts, which I’m fully aware of. The scope of the task was quite large, and completing it within seven days was challenging. I’m happy to discuss the project in more detail and explain my reasoning behind the decisions I made. I’m also open to feedback and suggestions on how to improve the project. I’m looking forward to hearing from you. Thank you for the opportunity to work on this project.


````
INSERT INTO transactions (transaction_id, user_id, type, sub_type, amount, status, description, created_at) VALUES
('01HV1C6XJZ8Y6A0P1R3D4G5T1A', 'test-user-123', 'deposit', 'reward', 150.00, 'completed', 'Mid-March bonus', '2025-03-10T15:30:00.000Z'),
('01HV1C7YJZ8Y6A0P1R3D4G5T2B', '22104563-5c86-43e1-8052-7837637b2fa6', 'credit', 'purchase', 95.50, 'pending', 'Online shopping', '2025-03-15T18:45:00.000Z'),
('01HV1C8ZJZ8Y6A0P1R3D4G5T3C', 'c661c243-7aa8-4d51-8280-c02406a7b3d8', 'deposit', 'refund', 120.75, 'completed', 'Refund for late delivery', '2025-03-20T12:10:00.000Z'),
('01HV1C9XJZ8Y6A0P1R3D4G5T4D', '90f438cc-9fdd-45da-8f43-154460d4b3ab', 'credit', 'reward', 60.00, 'completed', 'Loyalty bonus', '2025-03-25T09:20:00.000Z'),
('01HV1C0YJZ8Y6A0P1R3D4G5T5E', '22104563-5c86-43e1-8052-7837637b2fa6', 'deposit', 'purchase', 85.00, 'failed', 'Deposit for e-book purchase', '2025-03-30T14:00:00.000Z');

example sql script to insert some mock transactions you can run in any database explorer




screenshots of ui

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)