"use client";

import {useEffect, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

export default function TestSuccessPage() {
    const router = useRouter();
    const called = useRef(false);
    const params = useSearchParams();

    const amount = Number(params.get("amount"));
    const last4 = params.get("last4");
    const brand = params.get("brand") || "card";


    useEffect(() => {
        if (called.current) return;
        called.current = true;

        (async () => {
            const { data: session } = await supabase.auth.getSession();
            const userId = session?.session?.user?.id;
            if (!userId) return;

            await fetch("/api/payments/webhook-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    amount,
                    provider: "card",
                    card: {
                        brand,
                        last4,
                    },
                }),
            });

            router.push("/profile");
        })();
    }, []);


    return <p>Processing payment…</p>;
}
