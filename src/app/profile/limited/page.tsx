"use client";

import { useTranslation } from "react-i18next";
import { useAccountLimit } from "@/src/hooks/useAccountLimit";
import { supabase } from "@/src/hooks/supabaseClient";
import { toast } from "react-toastify";
import Profile from "@/src/app/profile/page";
import { useEffect, useState } from "react";

interface PasswordModalProps {
    password: string;
    setPassword: (v: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
    t: (key: string) => string;
}

function PasswordModal({
                           password,
                           setPassword,
                           onCancel,
                           onConfirm,
                           t,
                       }: PasswordModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{t("limit_enter_password")}</h3>
                <input
                    type="password"
                    className="modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("limit_password_placeholder")}
                    autoFocus
                />
                <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
                    <button className="overlay-btn confirm-btn" onClick={onConfirm}>
                        {t("limit_confirm")}
                    </button>
                    <button
                        className="overlay-btn cancel-btn"
                        style={{ background: "grey" }}
                        onClick={onCancel}
                    >
                        {t("limit_cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LimitAccount() {
    const { t } = useTranslation();
    const { currentLimit, loading, isLimited, setLimit, removeLimit, init } = useAccountLimit();

    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [actionType, setActionType] = useState<"set" | "remove" | null>(null);
    const [settingLimit, setSettingLimit] = useState(false);

    const [remainingMs, setRemainingMs] = useState(0);

    useEffect(() => {
        void init();
    }, [init]);

    useEffect(() => {
        if (!currentLimit || !isLimited) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRemainingMs((prev) => (prev !== 0 ? 0 : prev));
            return;
        }

        const targetTime = new Date(currentLimit.until).getTime();

        const updateRemaining = () => {
            const now = Date.now();
            const diff = Math.max(0, targetTime - now);
            setRemainingMs(diff);

            if (diff <= 0) {
                void init();
            }
        };

        const interval = setInterval(updateRemaining, 1000);
        updateRemaining();

        return () => clearInterval(interval);
    }, [currentLimit, isLimited, init]);

    const confirmPassword = async () => {
        if (!password) return;

        try {
            const { data: authData } = await supabase.auth.getUser();
            const userEmail = authData?.user?.email;

            if (!userEmail) {
                toast.error(t("limit_error_no_email"));
                return;
            }

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password,
            });

            if (loginError) {
                toast.error(t("limit_wrong_password"));
                setPassword("");
                return;
            }

            if (actionType === "set" && selectedDuration) {
                setSettingLimit(true);
                const ok = await setLimit(selectedDuration);
                if (ok) toast.success(t("limit_saved_success"));
                else toast.error(t("limit_save_error"));
                setSettingLimit(false);
            } else if (actionType === "remove") {
                await removeLimit();
                toast.success(t("limit_removed_success"));
            }

            setShowPasswordModal(false);
            setPassword("");
            setActionType(null);
        } catch {
            toast.error(t("system_error"));
        }
    };

    if (loading) return <div className="loading-container"><p>{t("limit_loading")}</p></div>;

    const remainingMinutes = Math.ceil(remainingMs / 60000);

    return (
        <>
            <Profile />
            <div className="limited-content">
                {currentLimit && isLimited ? (
                    <div className="status-active">
                        <h3>⛔ {t("limit_active_title")}</h3>
                        <p>{t("limit_will_restore")} {new Date(currentLimit.until).toLocaleString()}:</p>
                        <p>
                            {t("limit_remaining")} <b>{remainingMinutes}</b> {t("limit_minutes")}
                        </p>
                        <button
                            type="button"
                            style={{ background: "#c0392b", marginTop: "15px", color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
                            onClick={() => {
                                setActionType("remove");
                                setShowPasswordModal(true);
                            }}
                        >
                            🔓 {t("limit_remove_button")}
                        </button>
                    </div>
                ) : (
                    <div className="status-setup">
                        <h3>🕒 {t("limit_set_title")}</h3>
                        <p>{t("limit_set_description")}</p>

                        <select
                            value={selectedDuration ?? ""}
                            onChange={(e) => setSelectedDuration(e.target.value ? Number(e.target.value) : null)}
                            style={{ padding: '8px', marginBottom: '10px', width: '100%' }}
                        >
                            <option value="">{t("limit_select_duration")}</option>
                            <option value={24 * 60}>{t("limit_24h")}</option>
                            <option value={7 * 24 * 60}>{t("limit_1week")}</option>
                            <option value={30 * 24 * 60}>{t("limit_1month")}</option>
                        </select>

                        <button
                            type="button"
                            className="limited-btn"
                            disabled={!selectedDuration || settingLimit}
                            onClick={() => {
                                setActionType("set");
                                setShowPasswordModal(true);
                            }}
                            style={{ width: '100%', padding: '10px' }}
                        >
                            {settingLimit ? "..." : `🔒 ${t("limit_set_button")}`}
                        </button>
                    </div>
                )}
            </div>

            {showPasswordModal && (
                <PasswordModal
                    password={password}
                    setPassword={setPassword}
                    onCancel={() => {
                        setShowPasswordModal(false);
                        setPassword("");
                    }}
                    onConfirm={confirmPassword}
                    t={t}
                />
            )}
        </>
    );
}