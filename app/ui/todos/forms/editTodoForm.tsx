"use client";

import { useFormState } from "react-dom";

import { Session } from "next-auth";
import { TagIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";

import { TodoField, TagField } from "@/app/lib/definitions";
import { Button } from "@/app/ui/buttons";
import { getISOStringWithoutSecsAndMillisecs } from "@/app/lib/helpers";
import { editTodo } from "@/app/lib/actions";


export default async function EditTodoForm({tags, todo}: {tags: TagField[], todo: TodoField}) {
    const editTodoAction = editTodo.bind(null, todo.id);
    const [errorMessage, formAction] = useFormState(editTodoAction, undefined)

    const formated_due_time = getISOStringWithoutSecsAndMillisecs(new Date(todo.due_time));
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
                        {tags.map((tag) => (
                            (tag.title === todo.title ? (
                                <option key={tag.id} value={tag.title} selected>{tag.title}</option>
                            ) : (
                                <option key={tag.id} value={tag.title}>{tag.title}</option>
                            ))
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
                    defaultValue={todo.title}
                    placeholder="New todo title"
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
                defaultValue={todo.text}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm placeholder:text-gray-500 outline-teal-500 resize-none"
                placeholder="New description"
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
                defaultValue={formated_due_time}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm placeholder:text-gray-500 outline-teal-500 resize-none"
                />
            </div>
            <EditTodoButton />
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
    )
}

function EditTodoButton() {
    return (
        <Button className="mt-4">Edit Todo</Button>
    )
}