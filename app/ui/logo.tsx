import { BookmarkIcon } from "@heroicons/react/16/solid";

export default function Logo() {
    return (
        <div className="flex justify-center items-center gap-0.5">
            <span className="text-teal-600 text-2xl">Todos</span>
            <BookmarkIcon className="h-8 w-8 text-teal-600" />
        </div>
    );
}