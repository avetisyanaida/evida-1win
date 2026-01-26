"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { usePersonalDetails } from "@/src/hooks/usePersonalDetails";
import { supabase } from "@/src/hooks/supabaseClient";
import Profile from "@/src/app/profile/page";
import { PasswordChangeForm } from "@/src/components/PersonalDetails/PasswordChangeForm";
import { PersonalInfoForm } from "@/src/components/PersonalDetails/PersonalInfoForm";

export default function PersonalDetails() {
    const [activeTab, setActiveTab] = useState<"personal" | "password">("personal");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [savedUsername, setSavedUsername] = useState<string | null>(null);


    // 🔥 username status
    const [usernameStatus, setUsernameStatus] = useState<
        "idle" | "checking" | "taken" | "free"
    >("idle");

    const { t } = useTranslation();

    const {
        formsPersonal,
        handleChange,
        phone,
        setPhone,
        userId,
        loading,
        setLoading,
    } = usePersonalDetails();

    useEffect(() => {
        if (formsPersonal.userName) {
            setSavedUsername(
                formsPersonal.userName.trim().toLowerCase()
            );
        }
    }, []);

    const usernameRegex = /^[a-z0-9]{3,20}$/;

    useEffect(() => {
        const username = formsPersonal.userName
            ?.trim()
            .toLowerCase();

        if (!username || !usernameRegex.test(username)) {
            setUsernameStatus("idle");
            return;
        }

        if (username && username === savedUsername) {
            setUsernameStatus("idle");
            return;
        }

        let cancelled = false;

        const timeout = setTimeout(async () => {
            setUsernameStatus("checking");

            const { data } = await supabase
                .from("users")
                .select("user_id")
                .eq("user_name", username)
                .maybeSingle();

            if (cancelled) return;

            if (data && data.user_id !== userId) {
                setUsernameStatus("taken");
            } else {
                setUsernameStatus("free");
            }
        }, 500);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [formsPersonal.userName, userId, savedUsername]);


    const handlePasswordUpdate = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: formsPersonal.password,
            });

            if (error) {
                alert("Սխալ: " + error.message);
            } else {
                setPasswordSuccess(true);
                alert("Գաղտնաբառը թարմացվեց");
                window.location.reload();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // ❌ եթե username-ը զբաղված ա
        if (usernameStatus === "taken") {
            alert(t("usernameTaken"));
            return;
        }

        if (activeTab === "password") {
            await handlePasswordUpdate();
            return;
        }

        try {
            setLoading(true);

            if (!userId) {
                alert(t("userNotFound"));
                return;
            }

            const updates = {
                user_name: formsPersonal.userName || null,
                first_name: formsPersonal.firstName || null,
                last_name: formsPersonal.lastName || null,
                email: formsPersonal.email || null,
                phone_code: phone || null,
                gender: formsPersonal.gender || null,
                birth_day: formsPersonal.day
                    ? Number(formsPersonal.day)
                    : null,
                birth_month: formsPersonal.month || null,
                birth_year: formsPersonal.year
                    ? Number(formsPersonal.year)
                    : null,
                country: formsPersonal.country || null,
                personal_number: formsPersonal.personalNumber || null,
            };


            const { error } = await supabase
                .from("users")
                .update(updates)
                .eq("user_id", userId);

            if (!error) {
                alert(t("saveSuccess"));

                setSavedUsername(
                    formsPersonal.userName?.trim().toLowerCase() ?? null
                );
                setUsernameStatus("idle");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Profile />

            <section>
                <div className="container">
                    <div className="personal-details">
                        <div className="personal-details-tab">
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        className={activeTab === "personal" ? "active" : ""}
                                        onClick={() => setActiveTab("personal")}
                                    >
                                        {t("personalInfo")}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={activeTab === "password" ? "active" : ""}
                                        onClick={() => setActiveTab("password")}
                                    >
                                        {t("newPassword")}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {activeTab === "password" && passwordSuccess && (
                            <div className="success-message">
                                {t("passwordChanged")}
                            </div>
                        )}

                        {activeTab === "password" ? (
                            <PasswordChangeForm
                                formsPersonal={formsPersonal}
                                handleChange={handleChange}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}
                                showCurrentPassword={showCurrentPassword}
                                setShowCurrentPassword={setShowCurrentPassword}
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await handlePasswordUpdate();
                                }}
                            />
                        ) : (
                            <>
                                <PersonalInfoForm
                                    formsPersonal={formsPersonal}
                                    handleChange={handleChange}
                                    phone={phone}
                                    setPhone={setPhone}
                                    usernameStatus={usernameStatus}
                                />

                                {usernameStatus === "checking" && (
                                    <p style={{ color: "#aaa", fontSize: 12 }}>
                                        Ստուգվում է…
                                    </p>
                                )}
                                {usernameStatus === "taken" && (
                                    <p style={{ color: "red", fontSize: 12 }}>
                                        ❌ Օգտանունը զբաղված է
                                    </p>
                                )}
                                {usernameStatus === "free" && (
                                    <p style={{ color: "green", fontSize: 12 }}>
                                        ✅ Օգտանունը ազատ է
                                    </p>
                                )}
                            </>
                        )}

                        <button
                            type="button"
                            className="save-infos-personal"
                            disabled={loading}
                            onClick={handleSave}
                        >
                            {loading ? t("saving") : t("save")}
                        </button>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .success-message {
                    margin-bottom: 12px;
                    padding: 10px;
                    background: #e6fffa;
                    color: #065f46;
                    border: 1px solid #34d399;
                    border-radius: 6px;
                }
            `}</style>
        </>
    );
}
