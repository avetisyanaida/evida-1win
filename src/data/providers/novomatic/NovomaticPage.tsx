import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {novomaticGames} from "@/src/data/providers/novomatic/novomatic";

export const NovomaticPage = () => {
    return <CasinoGrid games={novomaticGames}/>
}