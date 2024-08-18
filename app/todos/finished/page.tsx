import { fetchTodos } from "@/app/lib/data";
import { auth } from "@/auth";

import FinishedTodos from "@/app/ui/todos/finishedTodos";

export default async function Page() {
    const session = await auth();
    const todos = await fetchTodos(session?.user?.email);
    const finished_todos = todos.filter((todo) => todo.finished === true)
    if (finished_todos.length >= 1) {
        return (
            <div className="flex flex-col justify-start items-center h-screen mt-6">
                <h1>Your finished todos with the amount of: <span className="text-red-500">{finished_todos.length}</span></h1>
                <FinishedTodos finished_todos={finished_todos}/>
            </div>
        )
    } else {
        return (
            <div className="flex justify-center items-center h-screen gap-5">
                <h1 className="text-xl">You don`t have finished todos =3</h1>
            </div>
        )
    }

}