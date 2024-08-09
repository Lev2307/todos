"use client";

import { TagIcon } from "@heroicons/react/20/solid";
import { TagField } from "../lib/definitions";
import { Button } from "./button";
import { useFormState } from "react-dom";
import { createTodo } from "@/app/lib/actions";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Session } from "next-auth";


export default async function CreateTodoForm({tags, session}: {tags: TagField[], session: Session | null}) {
    const user_email = session?.user?.email
    const createTodoAction = createTodo.bind(null, user_email);
    const [errorMessage, formAction] = useFormState(createTodoAction, undefined)
    console.log(new Date().toLocaleString());
    return (
        <form action={formAction} className="w-1/2">
            <div className="mt-4">
                <label htmlFor="tag" className="mb-2 block text-sm font-medium">
                    Choose tag
                </label>
                <div className="relative">
                    <select
                        id="tag"
                        name="tag"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 outline-teal-500"
                        defaultValue=""
                        required
                        aria-describedby="tag-error"
                        >
                        <option value="" disabled>
                            Select a tag
                        </option>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.title}>{tag.title}</option>
                        ))}
                    </select>
                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                    Title
                </label>
                <input type="text" 
                    name="title" 
                    id="title"
                    placeholder="Todo title"
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm placeholder:text-gray-500 outline-teal-500"
                    required
                    maxLength={50}
                    aria-describedby="title-error"
                 />
            </div>
            <div className="mt-4">
                <label htmlFor="text" className="mb-2 block text-sm font-medium">
                    Desciption
                </label>
                <textarea 
                name="text" 
                id="text"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm placeholder:text-gray-500 outline-teal-500 resize-none"
                placeholder="Description"
                maxLength={250}
                >
                </textarea>
            </div>
            <div className="mt-4">
                <label htmlFor="due_time" className="mb-2 block text-sm font-medium">
                    Due date
                </label>
                <input type="datetime-local"
                name="due_time" 
                id="due_time"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm placeholder:text-gray-500 outline-teal-500 resize-none"
                />
            </div>
            <CreateTodoButton />
            <div
              className="flex h-8 items-end space-x-1 mt-2"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage.message}</p>
                </>
              )}
            </div>
        </form>
    );
}

function CreateTodoButton() {
    return (
        <Button className="mt-4">Create Todo</Button>
    )
}