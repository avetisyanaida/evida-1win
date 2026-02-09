"use client";

import styles from "./HeroBanner.module.scss";

const ONEX_LINK =
    "https://refpa749456.pro/L?tag=s_5233256m_355c_tg_ru_tik_tok&site=5233256&ad=355"

export const HeroBanner = () => {
    const handleClick = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "1x_cta_click", {
                event_category: "affiliate",
                event_label: "hero_banner_1x",
            });
        }

        window.location.href = ONEX_LINK;
    };

    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.content}>
                    <span className={styles.badge}>🔥 SPECIAL OFFER</span>

                    <h2>💥 Приветственный бонус для новых пользователей</h2>

                    <ul>
                        <li>💰 Бонус на первый депозит</li>
                        <li>🎮 Казино и спортивные ставки</li>
                        <li>⚡ Регистрация за несколько минут</li>
                    </ul>

                    <button
                        onClick={handleClick}
                        className={styles.cta}
                    >
                        👉 Получить предложение
                    </button>

                    <p className={styles.note}>
                        ⚠️ 21+ · Партнёрский ресурс · Применяются условия
                    </p>
                </div>
            </div>
        </section>
    );
};
