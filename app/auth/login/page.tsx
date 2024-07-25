import LoginForm from "@/app/ui/loginForm";
import Image from "next/image";

export default function Page() {
    return (
        <section className="h-screen flex justify-center items-center gap-20">
            <Image 
                src="/login_cat.jpg"
                height={350}
                width={350}
                alt="login cat"
            />
            <div className="size-500 flex flex-col justify-center items-center bg-zinc-50 rounded shadow-xl mt-2">
                <LoginForm />
            </div>
        </section>
    )
}