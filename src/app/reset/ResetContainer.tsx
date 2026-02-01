
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";
import ResetPassword from "@/src/components/Login/ResetPassword";

export default function ResetContainer() {
    const params = useSearchParams();
    const router = useRouter();

    const code = params.get("code");
    const exchangedRef = useRef(false);

    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            // 1. Նախ ստուգում ենք՝ գուցե Supabase-ը արդեն մեզ լոգին է արել
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setReady(true);
                return;
            }

            // 2. Եթե սեսիա չկա, բայց URL-ում կա կոդ, նոր փորձում ենք exchange անել
            if (code && !exchangedRef.current) {
                exchangedRef.current = true;
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error("Exchange error:", error.message);
                    setError("Reset link expired or invalid");
                } else {
                    setReady(true);
                }
            } else if (!code) {
                setError("No reset code found");
            }
        };

        checkSession();
    }, [code]);


    const onSave = async (password: string) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError("Password update failed");
            return;
        }

        await supabase.auth.signOut();
        router.replace("/");
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!ready) return <p>Checking reset link…</p>;

    return (
        <ResetPassword
            loading={loading}
            onSave={onSave}
        />
    );
}
