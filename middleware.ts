import NextAuth from "next-auth";

import { authConfig } from "./auth.config";

// инициализация NextAuth.js с объектом authConfig
export default NextAuth(authConfig).auth;

export const config = {
    // matcher даёт возомжность Мидлвэйру запускаться на особых url или путях
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}