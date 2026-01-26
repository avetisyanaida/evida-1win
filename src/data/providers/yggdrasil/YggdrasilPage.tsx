import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {yggdrasilGames} from "@/src/data/providers/yggdrasil/yggdrasil";

export const YggdrasilPage = () => {
    return <CasinoGrid games={yggdrasilGames}/>
}