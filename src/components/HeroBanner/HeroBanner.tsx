"use client";

import styles from "./HeroBanner.module.scss";

const ONEX_LINK =
    "https://1wkzid.com/casino?p=z76b&sub1=telegram&sub2=tik_tok&sub3=site_url"

export const HeroBanner = () => {
    const handleClick = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "1win_cta_click", {
                event_category: "affiliate",
                event_label: "hero_banner_1win",
            });
        }

        window.location.href = ONEX_LINK;
    };

    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <span className={styles.badge}>🔥 1WIN BONUS</span>

                    <h2>🚀 Забери бонус 500% прямо сейчас</h2>

                    <ul>
                        <li>💰 Бонус на первый депозит</li>
                        <li>🎰 Онлайн-казино и ставки на спорт</li>
                        <li>⚡ Быстрая регистрация и моментальные выплаты</li>
                    </ul>

                    <button onClick={handleClick} className={styles.cta}>
                        👉 Забрать бонус
                    </button>

                    <p className={styles.note}>
                        ⚠️ 21+ · Партнёрский сайт · Возможны финансовые риски
                    </p>
                </div>
            </div>
        </section>
    );
};
