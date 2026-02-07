"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Lang = "hy" | "ru" | "en";

export const LangSwitcher = () => {
    const { i18n } = useTranslation();

    const [lang, setLang] = useState<Lang>("ru");
    const [open, setOpen] = useState(false);

    // 🔑 localStorage → միայն mount-ից հետո
    useEffect(() => {
        const savedLang = localStorage.getItem("lang") as Lang | null;

        if (savedLang && savedLang !== lang) {
            setLang(savedLang);
            i18n.changeLanguage(savedLang).catch(console.error);
        }
    }, []);

    const changeLang = (selectedLang: Lang) => {
        if (selectedLang === lang) return;

        setLang(selectedLang);
        i18n.changeLanguage(selectedLang).catch(console.error);
        localStorage.setItem("lang", selectedLang);
        setOpen(false);
    };

    const flagIcon: Record<Lang, string> = {
        ru: "icon russia",
        hy: "icon armenia",
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
                    <button className={'lang-btn'} onClick={() => changeLang("ru")}>
                        <i className="icon russia" /> RU
                    </button>
                    <button className={'lang-btn'} onClick={() => changeLang("hy")}>
                        <i className="icon armenia" /> HY
                    </button>
                    <button className={'lang-btn'} onClick={() => changeLang("en")}>
                        <i className="icon usa" /> EN
                    </button>
                </div>
            )}
        </div>
    );
};
