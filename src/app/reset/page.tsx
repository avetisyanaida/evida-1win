"use client";

import ResetPassword from "@/src/components/Login/ResetPassword";

export default function Reset () {
    console.log("🟡 RESET PAGE MOUNTED", {
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
    });

    return <ResetPassword/>
}