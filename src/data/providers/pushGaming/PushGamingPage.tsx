import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {pushGamingGames} from "@/src/data/providers/pushGaming/pushGaming";

export const PushGamingPage = () => {
    return <CasinoGrid games={pushGamingGames}/>
}