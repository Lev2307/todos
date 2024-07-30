import { db } from "@vercel/postgres";
import bcrypt from "bcrypt";
const { tags, users } = require('@/app/lib/placeholder-data');

const client = await db.connect();

async function createTagsTable() {
    await client.sql`CREATE TABLE IF NOT EXISTS tags (
        id SERIAL NOT NULL,
        title VARCHAR(15) NOT NULL,
        PRIMARY KEY (id)
    )`;
    // // Insert data into the "tags" table
    const insertedTags = await Promise.all(
        tags.map(async (tag: any) => {
          return client.sql`
          INSERT INTO tags (id, title)
          VALUES (${tag.id}, ${tag.title})
        `;
        }),
      );
    return insertedTags;
}

async function createUsersTable() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user: any) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );
}

async function createTodosTable() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`CREATE TABLE IF NOT EXISTS todos (
        id UUID DEFAULT uuid_generate_v4(),
        authorID UUID NOT NULL,
        tag VARCHAR(15) NOT NULL,
        text VARCHAR(255) NOT NULL,
        created_time TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
    )`;
}

export async function GET() {
    try {
      await client.sql`BEGIN`;
    //   await createTagsTable();
    //   await createTodosTable();
    // await createUsersTable();
      await client.sql`COMMIT`;
  
      return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
      await client.sql`ROLLBACK`;
      return Response.json({ error }, { status: 500 });
    }
  }