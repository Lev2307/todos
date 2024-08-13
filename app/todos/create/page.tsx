import CreateTodoForm from '@/app/ui/todos/createtodoForm';
import { fetchTags } from '@/app/lib/data';
import { auth } from '@/auth';
import Image from 'next/image';

export default async function Page() {
    const tags = await fetchTags();
    const session = await auth();
    return (
        <main className="flex justify-center items-center h-screen">
            <div className="size-750 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl mt-2">
                <div className='flex justify-center items-center'>
                    <h5 className='text-lg'>Create a new todo with mee =3</h5>
                    <Image
                        src="/silly_cat_on_create_todo.png"
                        height={100}
                        width={100}
                        alt="silly cat creating a new todo"
                        className='cursor-pointer'
                    >
                    </Image>
                </div>
                <CreateTodoForm tags={tags} session={session}/>
            </div>
        </main>
    )
}