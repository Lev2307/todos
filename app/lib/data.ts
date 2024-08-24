import { unstable_noStore as noStore } from "next/cache";

import { db } from "@vercel/postgres";

import { TagField, TodoField } from "./definitions";
import { checkTodoIsFinished } from "./helpers";
import { getUser } from "@/auth";

const client = await db.connect();

export async function fetchTags() {
    // noStore нужен, чтобы не кэшировать запрос
    noStore();
    try {
        const db_call = await client.sql<TagField>`
        SELECT id, title FROM tags
        ORDER BY title ASC
      `;
  
      const tags = db_call.rows;
      return tags;
    } catch(error) {
        throw error;
    }
}

export async function fetchTodos(user_email: string) {
    noStore();
    let user = await getUser(user_email);
    let telegram_chat_id = user.telegram_chat_id;
    let userID = user.id;
    try {
        // get Todos, filtered by session user
        const db_call = await client.sql<TodoField>`
        SELECT * FROM todos WHERE author_id=${userID}
        `;
        const todos = db_call.rows;
        const active_todos = todos.filter((todo) => todo.is_active === true);
        for (let todo in active_todos) {
            checkTodoIsFinished(active_todos[todo], telegram_chat_id);
        }
        return todos;
    } catch(error) {
        throw error;
    }
}

export async function fetchTodoById(todo_id: string) {
    try {
        const get_todo = await client.sql<TodoField>`SELECT * FROM todos WHERE id=${todo_id}`;
        return get_todo.rows[0];
    } catch(error) {
        throw error;
    }
}