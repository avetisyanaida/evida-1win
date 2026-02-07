"use client";

import Image from "next/image";
import styles from "./HeroBanner.module.scss";

const GOODWIN_LINK =
    "https://goodwin.am/open/register?btag=ag101636&agent_terms=true&agent_redirect=true";

export const HeroBanner = () => {
    const handleClick = () => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "goodwin_cta_click", {
                event_category: "affiliate",
                event_label: "hero_banner",
            });
        }

        window.open(GOODWIN_LINK, "_blank", "noopener,noreferrer");
    };

    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <span className={styles.badge}>🔥 TOP OFFER</span>

                <h1>🎁 Welcome Bonus</h1>

                <ul>
                    <li>💰 Մինչև <b>25,000 դրամ</b> բոնուս</li>
                    <li>🎰 <b>100 Free Spins</b></li>
                    <li>⚡ <b>100% Welcome Bonus</b></li>
                </ul>

                <button
                    onClick={handleClick}
                    className={styles.cta}
                >
                    🎮 Ստանալ բոնուսը
                </button>

                <p className={styles.note}>
                    ⏳ Առաջարկը գործում է նոր գրանցվողների համար
                </p>
            </div>

            <div className={styles.image}>
                <Image
                    src="/heroBanner.jpg"
                    alt="Goodwin Welcome Bonus"
                    fill
                    priority
                />
            </div>
        </section>
    );
};
