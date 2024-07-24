import Link from "next/link";
import Logo from "@/app/ui/logo";

export default function Navbar() {
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
    );
}