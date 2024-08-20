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
// {
//     "id": 5265383464,
//     "first_name": "Левк",
//     "username": "D1ssapointed",
//     "photo_url": "https://t.me/i/userpic/320/I7vlGFA5ASFstGfNaH2qtC151Qwh1ROWAuq0NeQNs8F__F8t-wqRJlY5pCJ6Exuo.jpg",
//     "auth_date": 1724173146,
//     "hash": "1815438485040552b0eecb531e280c786e164497cca628410c04fe19139c2283"
// }