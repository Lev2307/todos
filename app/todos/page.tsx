import Link from "next/link"

import { PlusIcon, ArrowRightIcon } from "@heroicons/react/16/solid"

import { auth, getUser } from "@/auth";
import { fetchTodos } from "../lib/data";

import TodosList from "../ui/todos/todosList";
import SearchBar from "../ui/todos/searchBar";
import { Button } from "../ui/buttons";

export default async function Page() {
    const session = await auth();
    const user = await getUser(session?.user?.email);
    const get_todos = await fetchTodos(user.email);
    const todos = get_todos.filter((todo) => todo.is_active === true);
    const finished_todos = get_todos.filter((todo) => todo.is_active === false);
    return (
        <section className="h-screen flex flex-col justify-start items-center">
            <div className="flex justify-center items-center mt-4 w-full gap-10">
                <SearchBar />
                {finished_todos.length >= 1 && <FinishedTodosButton />}
            </div>
            {todos.length > 0 ? (
                <TodosList todos={todos} user={user} />
            ) : (
                <h1 className="text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">You don`t have any active todos =3</h1>
            )}
            <Link className="flex justify-center items-center w-12 h-12 rounded-full hover:underline bg-teal-600 fixed bottom-5 right-5 hover:scale-125 transition-transform" href="/todos/create">
                <PlusIcon className="w-8 h-8 text-slate-200" />
            </Link>
        </section>
    )
}

function FinishedTodosButton() {
    return (
        <Link href="/todos/finished">
            <Button className="">Finished todos <ArrowRightIcon className="ml-3 h-5 w-5 text-gray-50" /></Button>
        </Link>
    )
}