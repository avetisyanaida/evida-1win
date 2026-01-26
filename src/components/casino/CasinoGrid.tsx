"use client";
import { GameCard } from "./GameCard";
import type { CasinoGame } from "@/src/types/casino";

export const CasinoGrid = ({ games }: { games: CasinoGame[] }) => {
    return (
        <div className="slots-block">
            {games.map((g, index) => (
                <GameCard key={`${g.id}-${g.provider ?? index}`} game={g} />
            ))}
        </div>

    );
};
