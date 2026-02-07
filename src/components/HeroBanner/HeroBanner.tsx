"use client";

import Image from "next/image";
import styles from "./HeroBanner.module.scss";

const ONEX_LINK =
    "https://reffpa.com/L?tag=d_5229724m_97c_tiktok_telegram&site=5229724&ad=97"

export const HeroBanner = () => {
    const handleClick = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "1x_cta_click", {
                event_category: "affiliate",
                event_label: "hero_banner_1x",
            });
        }

        window.open(ONEX_LINK, "_blank", "noopener,noreferrer");
    };

    return (
        <section className={styles.hero} style={{backgroundImage: "url(/1st-wide.webp)"}}>
            <div className="container">
                <div className={styles.content}>
                    <span className={styles.badge}>🔥 TOP OFFER</span>

                    <h2>💥 100% бонус на первый депозит</h2>

                    <ul>
                        <li>💰 До <b>60 000 AMD</b> бонус</li>
                        <li>⚡ <b>100%</b> на первое пополнение</li>
                        <li>🕒 Активация за <b>1–2 минуты</b></li>
                    </ul>

                    <button
                        onClick={handleClick}
                        className={styles.cta}
                    >
                        👉 Получить бонус
                    </button>

                    <p className={styles.note}>
                        ⚠️ Только для новых пользователей · 21+
                    </p>
                </div>
            </div>
        </section>
    );
};
