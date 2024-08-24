import { fetchTodos } from "@/app/lib/data";
import { auth, getUser } from "@/auth";

import FinishedTodos from "@/app/ui/todos/finishedTodos";

export default async function Page() {
    const session = await auth();
    const user = await getUser(session?.user?.email)
    const todos = await fetchTodos(user.email);
    const finished_todos = todos.filter((todo) => todo.is_active === false)
    if (finished_todos.length >= 1) {
        return (
            <div className="flex flex-col justify-start items-center h-screen mt-6">
                <h1>Your finished todos with the amount of: <span className="text-red-500">{finished_todos.length}</span></h1>
                <FinishedTodos user={user} finished_todos={finished_todos}/>
            </div>
        )
    } else {
        return (
            <div className="flex justify-center items-center h-screen gap-5">
                <h1 className="text-xl">You don`t have any finished todos =3</h1>
            </div>
        )
    }

}