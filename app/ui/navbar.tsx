"use client";

import Link from "next/link";
import Logo from "@/app/ui/logo";
import { Button } from "./button";
import { auth } from "@/auth"
import { logoutAction } from "../lib/actions";

export default function Navbar({isSignedIn} : {isSignedIn: boolean}) {
    if (isSignedIn) {
        return (
            <nav className="flex items-center justify-around">
                <Logo />
                <form action={logoutAction}>
                    <Button>Sign Out</Button>
                </form>
            </nav>
        )
    } else {
        return (
            <nav className="flex items-center justify-around">
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