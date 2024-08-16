"use client";

import Link from "next/link";

import { logoutAction } from "../lib/actions";

import Logo from "@/app/ui/logo";
import { Button } from "./buttons";

interface NavbarProps {
    isSignedIn: boolean;
    username: string | null | undefined; 
  }

export default function Navbar({isSignedIn, username}: NavbarProps) {
    if (isSignedIn) {
        return (
            <nav className="flex items-center justify-around mt-2">
                <Link href="/todos">
                    <Logo />
                </Link>
                <div className="flex flex-row justify-center items-center gap-10">
                    <span>{ username }</span>
                    <form action={logoutAction}>
                        <Button>Sign Out</Button>
                    </form>
                </div>
            </nav>
        )
    } else {
        return (
            <nav className="flex items-center justify-around mt-2">
                <Logo />
                <ul className="flex items-center gap-10">
                    <li className="hover:underline hover:text-teal-600">
                        <Link href="/auth/registration">Registration</Link>
                    </li>
                    <li className="hover:underline hover:text-teal-600">
                        <Link href="/auth/login">Login</Link>
                    </li>
                </ul>
            </nav>
        )   
    }
}