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
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 🔑 STEP 1 — exchange reset code → session
    useEffect(() => {
        const run = async () => {
            try {
                // միշտ logout, որ existing session-ը չխանգարի
                await supabase.auth.signOut();

                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");

                if (!code) {
                    setError("Invalid or missing reset code");
                    return;
                }

                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (error) {
                    console.error("RESET EXCHANGE ERROR:", error);
                    setError("Reset link is invalid or expired");
                    return;
                }

                setReady(true);
            } catch (e) {
                console.error(e);
                setError("Unexpected reset error");
            }
        };

        run();
    }, []);

    // 🔐 STEP 2 — update password
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError(t("reset.fillFields"));
            return;
        }

        if (password !== confirmPassword) {
            setError(t("reset.notMatch"));
            return;
        }

        if (password.length < 6) {
            setError(t("reset.minLength"));
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            console.error("UPDATE PASSWORD ERROR:", error);
            setError("Failed to update password");
            return;
        }

        setSuccess(true);

        setTimeout(async () => {
            await supabase.auth.signOut();
            router.replace("/login");
        }, 1500);
    };

    // 🟡 LOADING / ERROR STATE — երբեք դատարկ էջ
    if (!ready) {
        return (
            <div className="reset-password-wrapper">
                <h2>{t("reset.title")}</h2>

                {!error && <p>Loading reset…</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        );
    }

    // ✅ SUCCESS STATE
    if (success) {
        return (
            <div className="reset-password-wrapper">
                <h2>{t("reset.title")}</h2>
                <p style={{ color: "#4ade80" }}>
                    {t("reset.success")}
                </p>
            </div>
        );
    }

    // 🟢 MAIN FORM
    return (
        <div className="reset-password-wrapper">
            <h2>{t("reset.title")}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={submit}>
                <div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("reset.newPassword")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}>
                        👁
                    </button>
                </div>

                <div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("reset.confirmPassword")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}>
                        👁
                    </button>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? t("reset.saving") : t("reset.confirm")}
                </button>
            </form>
        </div>
    );
}
