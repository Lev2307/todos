'use server';

import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';
import { getUser } from '@/auth'



const RegistrationFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  password_confirmation: z.string().min(5)
});


export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
export async function createUser(prevState: string | undefined, formData: FormData) {
  const userData = RegistrationFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    password_confirmation: formData.get('password_confirmation')
  })
  if (userData.success) {
    const {name, email, password, password_confirmation} = userData.data;
    // check that user with entered email doesn`t exist
    const user_existed_with_entered_email = await getUser(email);
    if (user_existed_with_entered_email) {
      return 'This email has been already taken.';
    }
    // check two entered passwords are the same
    if (password === password_confirmation) {
      const uuid = crypto.randomUUID();
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        await sql`INSERT INTO users (id, name, email, password)
            VALUES (${uuid}, ${name}, ${email}, ${hashedPassword})`;
      } catch(error) {
        return { message: 'Database Error: Failed to Create user.' };
      }
    } else {
      return 'Two password didn`t match.';
    }
  }
  revalidatePath('/auth/login')
  redirect('/auth/login');
}

export async function logoutAction() {
  await signOut({redirectTo: '/'});
}