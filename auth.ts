import { sql } from '@vercel/postgres';

import NextAuth from "next-auth";
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Credentials позволяет выполнять вход с использованием произвольных учетных данных, таких как имя пользователя и пароль
import Credentials from 'next-auth/providers/credentials';

import { authConfig } from './auth.config';

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
}

export async function getUser(email: string | null | undefined) {
    // получение пользователя из бд по почте
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch(error) {
        throw new Error('Failed to fetch user.');
    }
}

  export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    // providers - массив, где я могу перечислить различные способы логина, такие как, Гитхаб или Гугл ( но в этом случае я использую Credentials )
    providers: [
      Credentials({
        async authorize(credentials) {
          // создаю объект с полями: почта, пароль на основе полученных данных из формы
          const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);
          // проверка на валидность данных
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;

            // сверка паролей
            const passwordMatch = await bcrypt.compare(password, user.password)
            if (passwordMatch) return user;
          }
          return null;
        },
      }),
    ],
  });