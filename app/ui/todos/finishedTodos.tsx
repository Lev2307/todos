"use client";

import { Suspense } from "react";

import { TodoField, User } from "@/app/lib/definitions";

import LoadingTodos from "./loadingTodos";
import TodoCard from "./todoCard";


export default function FinishedTodos({finished_todos, user}: {finished_todos: TodoField[], user: User}) {
    return (
        <Suspense fallback={<LoadingTodos />}>
            <div className="mt-4 w-full flex flex-col justify-center items-center">
                {finished_todos && finished_todos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} user={user} />
                ))}
            </div>
        </Suspense>
    )
}