'use server';

import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';
import { getUser } from '@/auth'
import { DueTimeValidation } from './helpers';

const RegistrationFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  password_confirmation: z.string().min(5)
});

const TodoFormSchema = z.object({
  id: z.string(),
  author_id: z.string(),
  tag: z.string({
    invalid_type_error: 'Please select a tag.',
  }),
  title: z.string(),
  text: z.string(),
  is_completed: z.boolean(),
  created_time:z.string(),
  due_time: z.string(),
});

const createTodoForm = TodoFormSchema.omit({id: true, author_id: true, is_completed: true, created_time: true});

export async function authenticate(prevState: any, formData: FormData) {
  let errorOccured = false;
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      errorOccured = true;
      switch (error.type) {
        case 'CallbackRouteError':
          return 'Invalid credentials.';
      }
    }
    throw error;
  } finally {
    if (errorOccured === false) {
      redirect('/todos');
    }
  }
}
export async function createUser(prevState: any, formData: FormData) {
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
      return { message: 'This email has been already taken.'};
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
      return { message: 'Two passwords didn`t match.' };
    }
  }
  revalidatePath('/auth/login')
  redirect('/auth/login');
}

export async function logoutAction() {
  await signOut({redirectTo: '/'});
}

export async function createTodo(email_is_exisitng: string | null | undefined, prevState: any, formData: FormData) {
  const TodoDataFields = createTodoForm.safeParse({
    tag: formData.get('tag'),
    title: formData.get('title'),
    text: formData.get('text'),
    due_time: formData.get('due_time')
  });
  if(!TodoDataFields.success) {
      return {
        errors: TodoDataFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Todo.',
      };
  }
  const { tag, title, text, due_time } = TodoDataFields.data;
  // validate due_time 
  if (DueTimeValidation(due_time)) {
    const created_time = new Date().toLocaleString().replace(',', '');
    let author = await getUser(email_is_exisitng);
    let author_id = author.id;
    const is_complited = false;
    try {
      await sql`
          INSERT INTO todos (author_id, is_complited, tag, title, text, created_time, due_time)
          VALUES (${author_id}, ${is_complited}, ${tag}, ${title}, ${text}, ${created_time}, ${due_time})
      `;
    } catch(error) {
        return { message: 'Database Error: Failed to Create Todo.' };
    }
  } else {
    return { message: 'Choose an appropriate date!' }
  }
  revalidatePath('/todos')
  redirect('/todos');
}