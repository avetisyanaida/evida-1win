import { useTranslation } from "react-i18next";
import React from "react";

interface Props {
    formsPersonal: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (v: boolean) => void;
    showCurrentPassword: boolean;
    setShowCurrentPassword: (v: boolean) => void;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    successMessage?: string; // ✅ Ահա այստեղ ավելացրեցինք
}

export const PasswordChangeForm = ({
                                       formsPersonal,
                                       handleChange,
                                       showPassword,
                                       setShowPassword,
                                       showConfirmPassword,
                                       setShowConfirmPassword,
                                       showCurrentPassword,
                                       setShowCurrentPassword,
                                       successMessage, // ✅ Ավելացրեցինք prop
                                   }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="passwords-info fade">
            <label>
                <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    onChange={handleChange}
                    value={formsPersonal.currentPassword}
                    placeholder={t("currentPassword")}
                />
                <i
                    className={showCurrentPassword ? "icon eye-open" : "icon eye-close"}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                />
            </label>

            <label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formsPersonal.password}
                    placeholder={t("newPassword")}
                />
                <i
                    className={showPassword ? "icon eye-open" : "icon eye-close"}
                    onClick={() => setShowPassword(!showPassword)}
                />
            </label>

            <label>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    onChange={handleChange}
                    value={formsPersonal.confirmPassword}
                    placeholder={t("confirmPassword")}
                />
                <i
                    className={showConfirmPassword ? "icon eye-open" : "icon eye-close"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
            </label>

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            <style jsx>{`
                .success-message {
                    margin-top: 10px;
                    padding: 8px;
                    background: #e6fffa;
                    color: #065f46;
                    border: 1px solid #34d399;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
};
