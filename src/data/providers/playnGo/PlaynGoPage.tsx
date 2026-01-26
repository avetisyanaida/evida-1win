import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {playnGoGames} from "@/src/data/providers/playnGo/playnGo";

export const PlaynGoPage = () => {
    return <CasinoGrid games={playnGoGames}/>
}