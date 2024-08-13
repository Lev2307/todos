import { TodoField } from "@/app/lib/definitions";
import { PencilIcon, ArchiveBoxXMarkIcon, DivideIcon } from "@heroicons/react/16/solid";
import { changeTodoStatus } from "@/app/lib/actions";
import Link from "next/link";
import { useFormState } from "react-dom";
import { Button } from "../button";


export default function TodoCard({todo}: {todo: TodoField}) {
    const changeTodoStatusAction = changeTodoStatus.bind(null, todo);
    const [msg, formAction] = useFormState(changeTodoStatusAction, undefined)
    const due_time = new Date(todo.due_time.toString()).toLocaleString("en-US", {year: 'numeric', month: 'numeric', day: 'numeric', hour12: false, hour: '2-digit', minute:'2-digit'});
    const edit_url = `/todos/edit/${todo.id}`;
    const delete_url = `/todos/delete/${todo.id}`;

    return (
        <div className="w-1/3 flex flex-col border border-teal-500 h-44 mt-4 border-2">
            <div className="flex justify-between items-center w-full p-2 h-1/3">
                <div className="flex justify-center items-center gap-3">
                    <h3 className="text-lg underline">{todo.title}</h3>
                    <h3 className="text-base mb-2">#{todo.tag}</h3>
                </div>
                <ul className="flex justify-center items-center gap-3">
                    <Link href={edit_url}>
                        <li className="w-8 h-8 bg-gray-400 border rounded-xl flex justify-center items-center cursor-pointer hover:bg-teal-500 transition ease-in-out delay-75">
                            <PencilIcon className="w-5 h-5 text-gray-50" />
                        </li>
                    </Link>
                    <Link href={delete_url}>
                        <li className="w-8 h-8 bg-gray-400 border rounded-xl flex justify-center items-center cursor-pointer hover:bg-teal-500 transition ease-in-out delay-75">
                            <ArchiveBoxXMarkIcon className="w-5 h-5 text-gray-50" />
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="w-full h-2/3 ml-2">
                <p className="text-sm">{todo.text}</p>
            </div>
            {!todo.finished && 
            <div className="w-full h-1/3 mb-1 flex justify-between items-center">
                <form action={formAction} className="ml-2 flex justify-center items-center gap-1">
                    {todo.is_active === true && <button className="h-10 items-center bg-teal-500 rounded-lg px-4 text-sm font-medium text-white">Make Inactive</button>}
                    {todo.is_active === false && <button className="h-10 items-center bg-red-500 rounded-lg px-4 text-sm font-medium text-white">Make Active</button>}
                </form>
                {todo.is_active === true && <h5 className="text-base mr-2">Could be active till: <span className="text-teal-500 underline">{due_time}</span></h5>}
                {todo.is_active === false && <h5 className="text-base mr-2">This todo is inactive =3</h5>}
            </div>}
            {todo.finished && 
            <div className="w-full h-1/3 mb-1 flex justify-center items-center">
                <h3 className="text-red-500 text-base">This todo is finished!</h3>
            </div>
            }  
        </div>
    )
}