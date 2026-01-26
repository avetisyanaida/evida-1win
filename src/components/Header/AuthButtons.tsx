import React from "react";

interface AuthButtonsProps {
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    t: (key: string) => string;
}

export const AuthButtons = ({ onLoginClick, onSignupClick, t }: AuthButtonsProps) => (
    <>
        <li>
            <button className="login-btn log" onClick={onLoginClick}>
                {t("login")}
            </button>
        </li>
        <li>
            <button className="register-btn log" onClick={onSignupClick}>
                {t("register")}
            </button>
        </li>
    </>
);
