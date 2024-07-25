import type { Metadata } from "next";
import "@/app/ui/globals.css";
import { inter } from "@/app/ui/fonts";
import Navbar from "./ui/navbar";
import { auth } from "@/auth";
 
export const metadata: Metadata = {
  title: "Todos App",
  description: "Just todos app =3",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let isSignedIn = false;
  if (session) {
    isSignedIn = true;
  }
  return (
      <html lang="en">
        <body className={`${inter.className} overflow-hidden`}>
          <Navbar isSignedIn={isSignedIn} />
          {children}
        </body>
      </html>
  );
}
