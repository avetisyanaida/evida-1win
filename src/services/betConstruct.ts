import type { CasinoGame } from "@/src/types/casino";

const API_KEY = process.env.BC_API_KEY!;
const BRAND_ID = process.env.BC_BRAND_ID!;
const OPERATOR_ID = process.env.BC_OPERATOR_ID!;
const BASE_URL = process.env.BC_BASE_URL!;

async function bcFetch(endpoint: string, body: object = {}) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
        body: JSON.stringify({
            brandId: BRAND_ID,
            operatorId: OPERATOR_ID,
            ...body,
        }),
    });

    if (!res.ok) {
        console.error("BetConstruct API Error:", await res.text());
        throw new Error(`BC API Error: ${res.status}`);
    }

    return await res.json();
}

export async function getBetConstructGamesByProvider(provider: string) {
    const data = await bcFetch("casino/game-list", {
        provider,
    });

    return data.games || [];
}

export function mapBCGamesToCasinoGames(apiGames: any[]): CasinoGame[] {
    return apiGames.map((g) => ({
        id: g.gameId,
        title: g.name,
        description: g.provider,
        imageUrl: g.imageUrl || g.thumbnail,
        provider: g.provider, //
    }));
}

export async function fetchCasinoGames(provider: string): Promise<CasinoGame[]> {
    const apiGames = await getBetConstructGamesByProvider(provider);

    return mapBCGamesToCasinoGames(apiGames);
}


export async function launchGame(gameId: string, token: string) {
    const data = await bcFetch("casino/launch", {
        gameId,
        token,
    });

    return data.launchUrl;
}
