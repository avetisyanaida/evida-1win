"use client";

import { useEffect, useState } from "react";
import type { CasinoGame } from "@/src/types/casino";
import { ModalComponent } from "@/src/components/ModalComponent/ModalComponent";

// Ձեր Supabase public bucket URL
const SUPABASE_PUBLIC_URL = "https://yxqgxsxseunohktzuxbm.supabase.co/storage/v1/object/public/casino-assets";

const IMAGE_EXTS = [".webp", ".jpg", ".png"];

export const GameCard = ({ game }: { game: CasinoGame }) => {
    // Base path in Supabase
    const basePath = `${SUPABASE_PUBLIC_URL}/${game.imageUrl.replace(/\.(webp|jpg|png)$/i, "")}`;

    const [variantIndex, setVariantIndex] = useState(0);
    const [src, setSrc] = useState(basePath + IMAGE_EXTS[0]);

    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check for mobile
    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth <= 767);
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    // Image fallback logic
    const handleError = () => {
        if (variantIndex < IMAGE_EXTS.length - 1) {
            const nextIndex = variantIndex + 1;
            setVariantIndex(nextIndex);
            setSrc(basePath + IMAGE_EXTS[nextIndex]);
        } else {
            setSrc("/default-game.png");
        }
    };

    const handleCardClick = () => isMobile && setIsModalOpen(true);
    const handlePlay = () => console.log("PLAY:", game.title);
    const handleDemo = () => console.log("DEMO:", game.title);

    return (
        <>
            <div className="casino-card" onClick={handleCardClick}>
                <img
                    src={src}
                    alt={game.title}
                    width={300}
                    height={200}
                    loading="lazy"
                    onError={handleError}
                />

                {!isMobile && (
                    <div className="buttons">
                        <h3>{game.title}</h3>
                        {game.description && <p>{game.description}</p>}
                        <button className="gaming" onClick={e => { e.stopPropagation(); handlePlay(); }}>Խաղալ</button>
                        <button className="demo" onClick={e => { e.stopPropagation(); handleDemo(); }}>Դեմո</button>
                    </div>
                )}
            </div>

            {isMobile && isModalOpen && (
                <ModalComponent title={game.title} onClose={() => setIsModalOpen(false)}>
                    <div className="game-modal-body">
                        <img src={src} alt={game.title} width={300} height={200} onError={handleError} />
                        {game.description && <p style={{ marginTop: 12 }}>{game.description}</p>}
                        <div className="buttons" style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
                            <button className="gaming" onClick={handlePlay}>Խաղալ</button>
                            <button className="demo" onClick={handleDemo}>Դեմո</button>
                        </div>
                    </div>
                </ModalComponent>
            )}
        </>
    );
};
