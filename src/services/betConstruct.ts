import type { CasinoGame } from "@/src/types/casino";

// ---------- ENV ----------
const API_KEY = process.env.BC_API_KEY!;
const BRAND_ID = process.env.BC_BRAND_ID!;
const OPERATOR_ID = process.env.BC_OPERATOR_ID!;
const BASE_URL = process.env.BC_BASE_URL!;

// ---------- COMMON FETCH ----------
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

// ---------- 1) GAME LIST BY PROVIDER ----------
export async function getBetConstructGamesByProvider(provider: string) {
    const data = await bcFetch("casino/game-list", {
        provider,
    });

    return data.games || [];
}

// ---------- 2) MAP TO OUR UI FORMAT ----------
export function mapBCGamesToCasinoGames(apiGames: any[]): CasinoGame[] {
    return apiGames.map((g) => ({
        id: g.gameId,
        title: g.name,
        description: g.provider,
        imageUrl: g.imageUrl || g.thumbnail,
        provider: g.provider, //
    }));
}

// ---------- 3) FINAL FUNCTION WE CALL IN UI ----------
export async function fetchCasinoGames(provider: string): Promise<CasinoGame[]> {
    const apiGames = await getBetConstructGamesByProvider(provider);

    return mapBCGamesToCasinoGames(apiGames);
}


// ---------- 4) GAME LAUNCH (PLAY) ----------
export async function launchGame(gameId: string, token: string) {
    const data = await bcFetch("casino/launch", {
        gameId,
        token,
    });

    return data.launchUrl; // iframe URL
}
