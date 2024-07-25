import Image from "next/image";
import Navbar from "@/app/ui/navbar";

export default function Home() {
  return (
    <section>
      <main className="flex justify-center items-center h-screen relative">
        <div className="flex justify-around items-center gap-20">
          <p className="text-slate-800 text-lg tracking-wide w-96 text-center leading-6">
            Welcome to <span className="text-teal-600">Todos</span>! Before you continue using our AWESOME application, you should log in =3
          </p>
          <Image
            src="/silly_cat.jpg"
            width={450}
            height={450}
            alt="Silly cat"
          />
        </div>
      </main>
    </section>
  );
}
