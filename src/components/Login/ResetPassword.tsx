"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPassword() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // ✅ ՍՏՈՒԳՈՒՄ ԵՆՔ՝ reset-ից հետո user կա՞
    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getUser();

            if (!data.user) {
                setError("Reset link is invalid or expired");
                return;
            }

            setReady(true);
        };

        check();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("Fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password too short");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError("Failed to update password");
            return;
        }

        await supabase.auth.signOut();
        router.replace("/login");
    };

    if (!ready) {
        return <div style={{ color: "red" }}>{error ?? "Loading…"}</div>;
    }

    return (
        <form onSubmit={submit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />

            <button disabled={loading}>Save password</button>
        </form>
    );
}
