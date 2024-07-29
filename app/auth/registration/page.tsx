import Image from "next/image";
import RegistrationForm from "@/app/ui/auth/registrationForm";

export default function Page() {
    return (
        <section className="flex h-screen justify-center items-center gap-20">
            <Image 
                src="/registration_cat.jpg"
                width={350}
                height={350}
                alt="registration cat"
            />
                <RegistrationForm />
        </section>
    )
}