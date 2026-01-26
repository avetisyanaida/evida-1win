"use client";

import { useTranslation } from "react-i18next";
import type { VerificationUser } from "@/src/types/verification";


interface VerifyEmailProps {
    user: VerificationUser | null;
}

export const VerifyEmail = ({ user }: VerifyEmailProps) => {
    const { t } = useTranslation();

    const email = user?.email || "";
    const verified = user?.verifiedEmail || false;

    return (
        <div className="verify-email verify">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="icon-file">
                    <i className="icon email"></i>
                    <p>{t("email_label")}</p>
                </div>

                {verified ? (
                    <p>✅ {t("email_verified_text")}</p>
                ) : (
                    <p>❌ {t("email_not_verified_text")}</p>
                )}
            </div>

            <label>
                <p>{t("email_input_label")}</p>
                <input type="email" value={email} readOnly />
                <i>{verified ? "✅" : "⌛"}</i>
            </label>
        </div>
    );
};
