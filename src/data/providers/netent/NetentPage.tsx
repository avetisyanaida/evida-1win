import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {netEntGames} from "@/src/data/providers/netent/netent";

export const NetentPage = () => {
    return <CasinoGrid games={netEntGames}/>
}