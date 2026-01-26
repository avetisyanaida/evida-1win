import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {playtechGames} from "@/src/data/providers/playtech/playtech";

export const PlaytechPage = () => {
    return <CasinoGrid games={playtechGames}/>
}