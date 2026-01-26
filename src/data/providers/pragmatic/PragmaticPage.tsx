import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {pragmaticGames} from "@/src/data/providers/pragmatic/pragmatic";

export const PragmaticPage = () => {
    return <CasinoGrid games={pragmaticGames}/>
}