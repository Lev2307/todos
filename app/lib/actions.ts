'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import got from 'got';
import { TelegramAuthData } from '@telegram-auth/react';

import { signIn, signOut } from '@/auth';
import { getUser } from '@/auth'
import { DueTimeValidation } from './helpers';
import { TELEGRAM_TOKEN, TodoField, User} from './definitions';

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
  created_time:z.string(),
  due_time: z.string(),
});

const createTodoForm = TodoFormSchema.omit({id: true, author_id: true, is_active: true, created_time: true});
const editTodoForm = TodoFormSchema.omit({id: true, author_id: true, is_active: true, created_time: true});

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
  });
  if (userData.success) {
    const {name, email, password, password_confirmation} = userData.data;
    // check that user with entered email doesn`t exist
    const user_existed_with_entered_email = await getUser(email);
    if (user_existed_with_entered_email) {
      return { message: 'This email has been already taken.'};
    }

    // check two entered passwords are the same
    if (password === password_confirmation) {
      const user_id = crypto.randomUUID();
      const created_time = new Date().toISOString();
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        await sql`INSERT INTO users (id, name, email, created_time, password)
            VALUES (${user_id}, ${name}, ${email}, ${created_time}, ${hashedPassword})`;
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
  await signOut({redirectTo: "/auth/login"});
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

export async function changeTodoStatusToInactive(params: [TodoField, User], prevState: any) {
    // changing todo status to inactive ( active -> inactive )
    const todo = params[0];
    const todo_id = todo.id;
    const user = params[1];
    const user_telegram_id = user.telegram_chat_id;
    const now = new Date();
    try {
        await sql`
            UPDATE todos
            SET is_active=${false},
                due_time=${now.toISOString()}
            WHERE id=${todo_id}
        `;
        if(user_telegram_id !== null) {
            const message = `You have just complited a new todo 📝\n Tag ${todo.tag}\n Title ${todo.title}\n Desc ${todo.text}\n Was finished on ${now.toLocaleString()}\nCongrats 🔥`;
            const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
            const data = {
              chat_id: user_telegram_id,
              text: message,
              parse_mode : "html"
            }
            const options = {json: data}
            await got.post(url, options);
        }
    } catch(error) {
      return { message: 'Database Error: Failed to get Todo.' };
    }
    revalidatePath('/todos')
    redirect('/todos');
}

export async function deleteTodo(id: string) {
  try {
    await sql`DELETE FROM todos WHERE id=${id}`;
  } catch(error) {
    return { message: 'Database Error: Failed to Delete Todo.' };
  }
  revalidatePath('/todos');
  redirect('/todos');
}

export async function add_telegram_to_user(data: TelegramAuthData, authorized_user: User) {
    const telegram_username = data.username;
    const telegram_chat_id = data.id;
    try {
      await sql`UPDATE users
                SET telegram_chat_id=${telegram_chat_id},
                    telegram_username=${telegram_username}
                WHERE id=${authorized_user.id}`
    } catch(error) {
      throw new Error('Failed to connect telegram to user account');
    }
    revalidatePath('/todos/profile');
    redirect('/todos/profile');
}

export async function checkTodoIsFinished(todo: TodoField, telegram_chat_id: number | null) {
  const now = new Date();
  const todo_due_time = new Date(todo.due_time);
  const user_telegram_id = telegram_chat_id;

  if (todo_due_time < now) {
      try {
          await sql`UPDATE todos 
                  SET is_active=${false},
                      due_time=${now.toISOString()}
                  WHERE id=${todo.id}`;
          if (user_telegram_id !== null) {
              const message = `Your todo is now finished -_- 📝\n Tag ${todo.tag}\n Title ${todo.title}\n Desc ${todo.text}\n Was finished on ${now.toLocaleString()}\nWe hope you did it till current time 🤔`;
              const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
              const data = {
                  chat_id: user_telegram_id,
                  text: message,
                  parse_mode : "html"
              }
              const options = {json: data}
              await got.post(url, options);
          }
      } catch (error) {
          throw error;
      }
  }
}