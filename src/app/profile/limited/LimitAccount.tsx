"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "@/src/hooks/supabaseClient";
import { useAccountLimit } from "@/src/hooks/useAccountLimit";

import Profile from "@/src/app/profile/page";
import LimitView from "./LimitView";
import PasswordModal from "./PasswordModal";
import {useTranslation} from "react-i18next";

export default function LimitAccount() {
    const { t } = useTranslation();
    const { currentLimit, loading, isLimited, setLimit, removeLimit, init } =
        useAccountLimit();

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
            setRemainingMs(0);
            return;
        }

        const target = new Date(currentLimit.until).getTime();

        const tick = () => {
            const diff = Math.max(0, target - Date.now());
            setRemainingMs(diff);
            if (diff <= 0) void init();
        };

        const id = setInterval(tick, 1000);
        tick();

        return () => clearInterval(id);
    }, [currentLimit, isLimited, init]);

    const confirmPassword = async () => {
        if (!password) return;

        try {
            const { data } = await supabase.auth.getUser();
            const email = data?.user?.email;

            if (!email) {
                toast.error(t("limit_error_no_email"));
                return;
            }

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(t("limit_wrong_password"));
                setPassword("");
                return;
            }

            if (actionType === "set" && selectedDuration) {
                setSettingLimit(true);
                const ok = await setLimit(selectedDuration);
                toast[ok ? "success" : "error"](
                    t(ok ? "limit_saved_success" : "limit_save_error")
                );
                setSettingLimit(false);
            }

            if (actionType === "remove") {
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

    if (loading) {
        return (
            <div className="loading-container">
                <p>{t("limit_loading")}</p>
            </div>
        );
    }

    const remainingMinutes = Math.ceil(remainingMs / 60000);

    return (
        <>
            <Profile />

            <div className="limited-content">
                <LimitView
                    t={t}
                    isLimited={isLimited}
                    currentLimit={currentLimit}
                    remainingMinutes={remainingMinutes}
                    selectedDuration={selectedDuration}
                    settingLimit={settingLimit}
                    onSelectDuration={setSelectedDuration}
                    onSetClick={() => {
                        setActionType("set");
                        setShowPasswordModal(true);
                    }}
                    onRemoveClick={() => {
                        setActionType("remove");
                        setShowPasswordModal(true);
                    }}
                />
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
