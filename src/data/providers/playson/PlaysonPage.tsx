import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {playsonGames} from "@/src/data/providers/playson/playson";

export const PlaysonPage = () => {
    return <CasinoGrid games={playsonGames}/>
}