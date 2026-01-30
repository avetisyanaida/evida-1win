"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import hy from "../locales/hy.json";
import en from "../locales/en.json";
import ru from "../locales/ru.json";

const resources = {
    hy: { translation: hy },
    en: { translation: en },
    ru: { translation: ru },
};

if (!i18next.isInitialized) {
    i18next
        .use(initReactI18next)
        .init({
            resources,
            lng:
                typeof window !== "undefined"
                    ? localStorage.getItem("lang") || "ru"
                    : "ru",
            fallbackLng: "ru",
            interpolation: { escapeValue: false },
        })
        .catch((err) => console.error("i18n init error:", err));
}

export default i18next;
