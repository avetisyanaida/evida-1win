import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {microGamingGames} from "@/src/data/providers/microGaming/microGaming";

export const MicroGamingPage = () => {
    return <CasinoGrid games={microGamingGames}/>
}