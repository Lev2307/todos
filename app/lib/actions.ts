'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { signIn, signOut } from '@/auth';
import { getUser } from '@/auth'
import { DueTimeValidation } from './helpers';
import { TodoField } from './definitions';

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
  is_active: z.boolean(),
  finished: z.boolean(),
  created_time:z.string(),
  due_time: z.string(),
});

const createTodoForm = TodoFormSchema.omit({id: true, author_id: true, is_active: true, finished: true, created_time: true});
const editTodoForm = TodoFormSchema.omit({id: true, author_id: true, is_active: true, finished: true, created_time: true});

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
  // revaildatePath - очистка кэша на опред. url
  revalidatePath('/auth/login')
  redirect('/auth/login');
}

export async function logoutAction() {
  await signOut({redirectTo: '/'});
}

export async function createTodo(user_email: string | null | undefined, prevState: any, formData: FormData) {
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
      const created_time = new Date().toISOString();
      let author = await getUser(user_email);
      let author_id = author.id;
      try {
        await sql`
            INSERT INTO todos (author_id, tag, title, text, created_time, due_time)
            VALUES (${author_id}, ${tag}, ${title}, ${text}, ${created_time}, ${due_time})
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

export async function editTodo(todo_id: string, prevState: any, formData: FormData) {
  const NewTodoDataFields = editTodoForm.safeParse({
      tag: formData.get('tag'),
      title: formData.get('title'),
      text: formData.get('text'),
      due_time: formData.get('due_time'),
  })
  if(!NewTodoDataFields.success) {
    return {
      errors: NewTodoDataFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit Todo.',
    };
  }
  const {tag, title, text, due_time} = NewTodoDataFields.data;
  // validate due_time 
  if (DueTimeValidation(due_time)) {
    const edited_time = new Date().toISOString();
    try {
      await sql`
          UPDATE todos
          SET tag=${tag},
              title=${title},
              text=${text},
              created_time=${edited_time},
              due_time=${due_time}
          WHERE id=${todo_id}
      `;
    } catch(error) {
        return { message: 'Database Error: Failed to Edit Todo.' };
    }
  } else {
    return { message: 'Choose an appropriate date!' }
}
revalidatePath('/todos')
redirect('/todos');
}

export async function changeTodoStatus(todo: TodoField, prevState: any) {
    // changing todo status to opposite ( active -> non active, non active -> active ) if todo isn`t finished one
    const todo_id = todo.id
    const new_status = !todo.is_active;
    if (!todo.finished) {
        try {
          await sql`
              UPDATE todos
              SET is_active=${new_status}
              WHERE id=${todo_id}
          `;
      } catch(error) {
        return { message: 'Database Error: Failed to get Todo.' };
      }
      revalidatePath('/todos')
      redirect('/todos');
    } else {
      return { message: 'this todo is finished, you can`t change its status ;>' };
    }

}

export async function deleteTodo(id: string) {
  try {
    await sql`DELETE FROM todos WHERE id=${id}`;
  } catch(error) {
    return { message: 'Database Error: Failed to Delete Todo.' };
  }
  revalidatePath('/todos')
  redirect('/todos');
}