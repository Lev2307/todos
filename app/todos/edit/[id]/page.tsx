import { fetchTodoById, fetchTags } from "@/app/lib/data";

import EditTodoForm from "@/app/ui/todos/forms/editTodoForm";

export default async function Page({ params }: { params: { id: string } }) {
    const todo = await fetchTodoById(params.id);
    const tags = await fetchTags();
    return (
        <main className="flex h-screen justify-center items-center">
            <div className="size-750 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl">
                <h1 className="text-xl">Editing Todo ╰(● ⋏ ●)╯: <span className="text-teal-500 text-lg">{todo.title}</span></h1>
                <EditTodoForm tags={tags} todo={todo} />
            </div>
        </main>
    )
}