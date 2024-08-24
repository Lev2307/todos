import { ArrowRightIcon } from "@heroicons/react/16/solid";

import { auth, getUser } from "@/auth";
import AuthorizeViaTelegramButton from "@/app/ui/auth/authorizeViaTelegramButton";
import { Button } from "@/app/ui/buttons";

export default async function Page() {
    const session = await auth();
    const user = await getUser(session?.user?.email);
    const created_time = new Date(user.created_time).toLocaleDateString("ru");
    return (
        <section className="p-4 flex justify-center items-center h-screen">
            <div className="size-500 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl mt-2">
                <ul>
                    <li className="text-xl">Username: <span className="text-lg text-teal-500">{user.name}</span></li>
                    <li className="text-xl">Email: <span className="text-lg text-teal-500">{user.email}</span></li>
                    <li className="text-xl">Joined since: <span className="text-lg text-teal-500">{created_time}</span></li>
                    {user.telegram_username === null ? (
                        <AuthorizeViaTelegramButton user={user} />
                    ) : (
                        <div className="mt-3 flex flex-col justify-center items-center gap-1">
                            <h1 className="text-xl">Your telegram: <span className="text-lg text-teal-500">{user.telegram_username}</span></h1>
                            <form action="/todos/profile/unlink_telegram" method="post">
                                <Button>Disable your telegram <ArrowRightIcon className="h-5 w-5 text-gray-100 ml-1"/></Button>
                            </form>
                        </div>
                    )}
                </ul>
            </div>
        </section>
    )
}