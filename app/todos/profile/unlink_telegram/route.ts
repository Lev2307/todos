import { redirect } from "next/navigation";

import { sql } from "@vercel/postgres";

import { auth, getUser } from "@/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    const session = await auth();
    const user = await getUser(session?.user?.email);
    try {
        await sql`UPDATE users
                SET telegram_chat_id=null,
                    telegram_username=null
                WHERE id=${user.id}`
    } catch(error) {
        throw new Error('Database error: Failed to update user');
    }
    revalidatePath('/todos/profile');
    redirect('/todos/profile');
}