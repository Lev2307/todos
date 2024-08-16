import CreateTodoForm from '@/app/ui/todos/forms/createtodoForm';
import { fetchTags } from '@/app/lib/data';
import { auth } from '@/auth';

export default async function Page() {
    const tags = await fetchTags();
    const session = await auth();
    return (
        <main className="flex justify-center items-center h-screen">
            <div className="size-750 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl">
                <h5 className='text-xl'>Create a new todo (◕‿◕)๑</h5>
                <CreateTodoForm tags={tags} session={session}/>
            </div>
        </main>
    )
}