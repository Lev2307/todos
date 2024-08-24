"use client";

import { Suspense } from "react";

import { LoginButton } from "@telegram-auth/react";

import { add_telegram_to_user } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";

export default async function AuthorizeViaTelegramButton({user}: {user: User}) {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <div className="mt-2 flex justify-center items-center">
                <LoginButton
                    botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME!}
                    showAvatar={false}
                    onAuthCallback={(data) => {
                        add_telegram_to_user(data, user);
                    }}
                />
            </div>
        </Suspense>
    )
}