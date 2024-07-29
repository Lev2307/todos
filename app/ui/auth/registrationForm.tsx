"use client";

import { EnvelopeIcon, UserIcon, KeyIcon, LockClosedIcon, UserPlusIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "../button";
import { useFormState } from "react-dom";
import { createUser } from "@/app/lib/actions";

export default function RegistrationForm() {
    const [errorMessage, formAction] = useFormState(createUser, undefined);
    return (
        <form action={formAction} className="w-400">
            <div className="relative">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-teal-500"
                type="name"
                name="name" 
                placeholder="Your name"
                required
                id="" />
                <UserIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-teal-500" />
            </div>
            <div className="relative mt-4">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-teal-500"
                type="email"
                name="email" 
                placeholder="Your email"
                required
                id="" />
                <EnvelopeIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-teal-500" />
            </div>
            <div className="relative mt-4">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-teal-500"
                type="password"
                name="password" 
                placeholder="Your password"
                required
                id="" />
                <KeyIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-teal-500" />
            </div>
            <div className="relative mt-4">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm placeholder:text-gray-500 outline-teal-500"
                type="password"
                name="password_confirmation" 
                placeholder="Your password"
                required
                id="" />
                <LockClosedIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-teal-500" />
            </div>
            <RegistrationButton />
            <div
              className="flex h-8 items-end space-x-1 mt-2"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
        </form>
    )
}

function RegistrationButton() {
    return (
        <Button className="mt-4 w-full">
            Create Account <UserPlusIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    )
}