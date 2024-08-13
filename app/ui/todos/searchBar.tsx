"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
    const searchParams = useSearchParams(); 
    const router = useRouter();
    const pathname = usePathname();

    function handleInput(value: string) {
        const params = new URLSearchParams(searchParams);
        if ( value ) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        router.push(`${pathname}?${params}`);
    }
    return (
        <form action="" className="relative w-1/2 mt-4">
            <input type="text"
            name="searchInput" 
            id="searchInput"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-teal-500"
            placeholder="Search todos by title..."
            maxLength={20}
            onChange={(e) => {handleInput(e.target.value)}}
            />
            <MagnifyingGlassIcon className="w-6 h-6 absolute top-2 left-2 pointer-events-none text-gray-500 peer-focus:text-teal-500" />
        </form>
    )
}