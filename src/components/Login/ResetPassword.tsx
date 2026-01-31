"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";

export default function ResetPassword() {
    const { t } = useTranslation();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [ready, setReady] = useState(false);

    // 1️⃣ PKCE exchange
    useEffect(() => {
        const run = async () => {
            const params = new URLSearchParams(window.location.search);
            if (params.get("type") !== "recovery") {
                router.replace("/");
                return;
            }

            const { error } = await supabase.auth.exchangeCodeForSession(
                window.location.search
            );

            if (error) {
                setMsg(t("reset.error"));
                return;
            }

            setReady(true);
        };

        run();
    }, [router, t]);

    if (!ready) return null;

    // 2️⃣ update password
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setMsg(t("reset.fillFields"));
            return;
        }
        if (password !== confirmPassword) {
            setMsg(t("reset.notMatch"));
            return;
        }
        if (password.length < 6) {
            setMsg(t("reset.minLength"));
            return;
        }

        setLoading(true);
        setMsg("");

        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            setMsg(t("reset.error"));
            return;
        }

        setMsg(t("reset.success"));

        setTimeout(async () => {
            await supabase.auth.signOut();
            router.push("/login");
        }, 1200);
    };

    return (
        <div className="reset-password-wrapper">
            <h2>{t("reset.title")}</h2>

            {msg && <p>{msg}</p>}

            <form onSubmit={submit}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("reset.newPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}>
                    👁
                </button>

                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("reset.confirmPassword")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirmPassword(v => !v)}>
                    👁
                </button>

                <button disabled={loading}>
                    {loading ? t("reset.saving") : t("reset.confirm")}
                </button>
            </form>
        </div>
    );
}
