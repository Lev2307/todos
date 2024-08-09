import type { Metadata } from "next";
import "@/app/ui/globals.css";
import { poppins } from "@/app/ui/fonts";
import Navbar from "./ui/navbar";
import { auth } from "@/auth";

 
export const metadata: Metadata = {
  title: "Todos App",
  description: "Just todos app =3",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const session = await auth();
  let isSignedIn = false;
  let username;
  if (session) {
    isSignedIn = true;
    username = session.user?.name;
  }
  return (
      <html lang="en">
        <body className={`${poppins.className} overflow-hidden`}>
          <Navbar isSignedIn={isSignedIn} username={username} />
          {children}
        </body>
      </html>
  );
}
