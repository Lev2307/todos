import Link from "next/link"
import { PlusIcon } from "@heroicons/react/16/solid"

export default async function Page() {
    return (
        <section className="h-screen">
            {/* todos */}
            <Link className="flex justify-center items-center w-12 h-12 rounded-full hover:underline bg-teal-600 fixed bottom-5 right-5 hover:scale-125 transition-transform" href="/todos/create">
                <PlusIcon className="w-8 h-8 text-slate-200" />
            </Link>
        </section>
    )
}