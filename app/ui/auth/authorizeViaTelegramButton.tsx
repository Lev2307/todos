"use client";

import { LoginButton } from "@telegram-auth/react";
import { validation } from "@/app/lib/helpers";

export default function AuthorizeViaTelegramButton() {
    return (
        <div className="mt-4">
            <LoginButton
                botUsername={process.env.NEXT_PUBLIC_BOT_USERNAME!}
                showAvatar={false}
                onAuthCallback={(data) => {
                    validation(data);
                }}
            />
        </div>
    )
}