import CreateTodoForm from '@/app/ui/createtodoForm';
import { fetchTags } from '@/app/lib/data';
import { auth } from '@/auth';
export default async function Page() {
    const tags = await fetchTags();
    const session = await auth();
    return (
        <main className="flex justify-center items-center h-screen">
            <div className="size-750 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl mt-2">
                <h5>Create a new todo =3</h5>
                <CreateTodoForm tags={tags} session={session}/>
            </div>
        </main>
    )
}