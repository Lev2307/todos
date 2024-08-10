import Link from "next/link"
import { PlusIcon } from "@heroicons/react/16/solid"
import TodoCard from "../ui/todos/todoCard";
import { auth } from "@/auth";
import { Suspense } from "react";
import { fetchTodos } from "../lib/data";
import LoadingTodos from "../ui/todos/loadingTodos";

export default async function Page() {
    const session = await auth();
    const todos = await fetchTodos(session?.user?.email);
    return (
        <section className="h-screen flex flex-col justify-start items-center">
            <Suspense fallback={<LoadingTodos />}>
                <div className="ml-4 w-full flex flex-col justify-center items-center">
                    {todos && todos.map((todo) => (
                        <TodoCard key={todo.id} todo={todo} />
                    ))}
                </div>
            </Suspense>
            <Link className="flex justify-center items-center w-12 h-12 rounded-full hover:underline bg-teal-600 fixed bottom-5 right-5 hover:scale-125 transition-transform" href="/todos/create">
                <PlusIcon className="w-8 h-8 text-slate-200" />
            </Link>
        </section>
        
    )
}