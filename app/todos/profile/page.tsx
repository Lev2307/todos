import { auth, getUser } from "@/auth";
import AuthorizeViaTelegramButton from "@/app/ui/auth/authorizeViaTelegramButton";

export default async function Page() {
    const session = await auth();
    const user = await getUser(session?.user?.email);
    const created_time = new Date(user.created_time).toLocaleDateString("ru");
    return (
        <section className="p-4 flex justify-center items-center h-screen">
            <div className="size-500 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl mt-2">
                <ul>
                    <li className="text-lg">Username: <span className="text-base text-teal-500">{user.name}</span></li>
                    <li className="text-lg">Email: <span className="text-base text-teal-500">{user.email}</span></li>
                    <li className="text-lg">Joined since: <span className="text-base text-teal-500">{created_time}</span></li>
                </ul>
                <AuthorizeViaTelegramButton />
            </div>
        </section>
    )
}