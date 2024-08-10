"use client";

import { TailSpin } from "react-loader-spinner";


export default function LoadingTodos() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TailSpin visible={true} height="80" width="80" color="#14B8A6" ariaLabel="tail-spin-loading" radius="1"/>
        </div>
    )
}