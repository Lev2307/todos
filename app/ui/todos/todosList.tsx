"use client";


import { Suspense } from "react";
import { useSearchParams } from 'next/navigation'

import { TodoField, User } from "@/app/lib/definitions";

import TodoCard from "./todoCard";
import LoadingTodos from "./loadingTodos";


export default function TodosList({todos, user}: {todos: TodoField[], user: User}) {
    const searchParams = useSearchParams();
    const searchValue = searchParams.get('q') || '';
    const filteredTodos = todos.filter((todo) => todo.title.startsWith(searchValue));
    if (filteredTodos.length >= 1) {
        return (
            <Suspense fallback={<LoadingTodos />}>
                <div className="mt-4 w-full flex flex-col justify-center items-center">
                    {filteredTodos && filteredTodos.map((todo) => (
                        <TodoCard key={todo.id} todo={todo} user={user} />
                    ))}
                </div>
            </Suspense>
        )
    } else {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-lg">You don`t have todos with title: <span className="text-teal-500 text-lg">{searchValue}</span></h1>
            </div>
        )
    }

}