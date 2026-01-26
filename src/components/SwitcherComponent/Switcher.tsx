"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Lang = "hy" | "ru" | "en";

const getInitialLang = (): Lang => {
    if (typeof window === "undefined") return "hy";
    return (localStorage.getItem("lang") as Lang) || "hy";
};

export const LangSwitcher = () => {
    const { i18n } = useTranslation();

    const [lang, setLang] = useState<Lang>(getInitialLang);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!i18n.isInitialized) return;
        i18n.changeLanguage(lang).catch(console.error);
    }, [i18n, lang]);

    const changeLang = (selectedLang: Lang) => {
        if (selectedLang === lang) return;

        setLang(selectedLang);
        setOpen(false);
        localStorage.setItem("lang", selectedLang);
    };

    if (!i18n.isInitialized) return null;

    const flagIcon: Record<Lang, string> = {
        hy: "icon armenia",
        ru: "icon russia",
        en: "icon usa",
    };

    return (
        <div className="lang-dropdown">
            <button
                className="lang-selected"
                onClick={() => setOpen(!open)}
                aria-label="Change language"
            >
                <i className={flagIcon[lang]} />
            </button>

            {open && (
                <div className="lang-menu">
                    <button onClick={() => changeLang("hy")}>
                        <i className="icon armenia" /> HY
                    </button>
                    <button onClick={() => changeLang("ru")}>
                        <i className="icon russia" /> RU
                    </button>
                    <button onClick={() => changeLang("en")}>
                        <i className="icon usa" /> EN
                    </button>
                </div>
            )}
        </div>
    );
};
