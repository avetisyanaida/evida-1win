import { useState, useMemo } from "react";
import { allCasinoGames } from "@/src/data/allCasinoGames";

export const useCasinoSearch = () => {
    const [query, setQuery] = useState("");
    const [provider, setProvider] = useState("All");

    const filteredGames = useMemo(() => {
        let games = allCasinoGames;

        if (provider !== "All") {
            games = games.filter(g => g.provider === provider);
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            games = games.filter(g =>
                g.title.toLowerCase().includes(q)
            );
        }

        return games;
    }, [query, provider]);

    return {
        query,
        setQuery,
        provider,
        setProvider,
        filteredGames,
    };
};
