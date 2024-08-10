import { db } from "@vercel/postgres";
import { TagField, TodoField } from "./definitions";
import { unstable_noStore as noStore } from "next/cache";
import { getUser } from "@/auth";

const client = await db.connect();

export async function fetchTags() {
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

export async function fetchTodos(user_email: string | null | undefined) {
    noStore();
    let user = await getUser(user_email);
    let userID = user.id;
    try {
        // get Todos, filtered by session user and todo completion
        const db_call = await client.sql<TodoField>`
        SELECT * FROM todos WHERE author_id=${userID} AND is_complited=${false}
        `
        const todos = db_call.rows;
        return todos;
    } catch(error) {
        throw error;
    }
}