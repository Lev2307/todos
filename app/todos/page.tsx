import Link from "next/link"
import { PlusIcon } from "@heroicons/react/16/solid"

import SearchBar from "../ui/todos/searchBar";

import { auth } from "@/auth";
import { fetchTodos } from "../lib/data";
import TodosList from "../ui/todos/todosList";

export default async function Page() {
    const session = await auth();
    const todos = await fetchTodos(session?.user?.email);
    return (
        <section className="h-screen flex flex-col justify-start items-center">
            <SearchBar />
            {todos.length > 0 ? (
                <TodosList todos={todos} />
            ) : (
                <h1 className="text-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">No todos have been created on this acc =3</h1>
            )}
            <Link className="flex justify-center items-center w-12 h-12 rounded-full hover:underline bg-teal-600 fixed bottom-5 right-5 hover:scale-125 transition-transform" href="/todos/create">
                <PlusIcon className="w-8 h-8 text-slate-200" />
            </Link>
        </section>
    )
}