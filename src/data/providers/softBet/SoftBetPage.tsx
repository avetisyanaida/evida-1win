import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {softBetGames} from "@/src/data/providers/softBet/softBet";

export const SoftBetPage = () => {
    return <CasinoGrid games={softBetGames}/>
}