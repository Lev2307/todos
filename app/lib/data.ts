import { db } from "@vercel/postgres";
import { TagField } from "./definitions";

const client = await db.connect();

export async function fetchTags() {
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