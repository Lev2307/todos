import { TrashIcon } from '@heroicons/react/16/solid';
import { deleteTodo } from '../lib/actions';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg bg-teal-500 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 active:bg-teal-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DeleteButton({id}: {id: string}) {
  const deleteTodoById = deleteTodo.bind(null, id)
  return (
    <form action={deleteTodoById}>
      <button className="w-8 h-8 bg-gray-400 border rounded-xl flex justify-center items-center cursor-pointer hover:bg-teal-500 transition ease-in-out delay-75">
          <TrashIcon className="w-5 h-5 text-gray-50" />
      </button>
    </form>
  );
}