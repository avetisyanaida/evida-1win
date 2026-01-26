import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {netGamingGames} from "@/src/data/providers/netGaming/netGaming";

export const NetGamingPage = () => {
    return <CasinoGrid games={netGamingGames}/>
}