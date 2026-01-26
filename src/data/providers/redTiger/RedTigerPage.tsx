import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {redTigerGames} from "@/src/data/providers/redTiger/redTiger";

export const RedTigerPage = () => {
    return <CasinoGrid games={redTigerGames}/>
}