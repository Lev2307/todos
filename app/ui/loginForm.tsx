'use client';

import { EnvelopeIcon, KeyIcon, ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "./button";
import { authenticate } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useFormState(
    authenticate,
    undefined,
  );
    return (
        <form action={formAction} method="post">
            <div className="relative">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="email"
                name="email" 
                placeholder="Enter email"
                id="" />
            <EnvelopeIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="mt-4 relative">
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={5}
              />
            <KeyIcon className="w-6 h-6 absolute top-2 left-2 text-gray-500 pointer-events-none text-gray-500 peer-focus:text-gray-900" />
            </div>
            <LoginButton />
            <div
              className="flex h-8 items-end space-x-1"
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
    );
}

function LoginButton() {
    return (
      <Button className="mt-4 w-full">
        Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    );
  }