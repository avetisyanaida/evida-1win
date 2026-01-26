import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {amusnetGames} from "@/src/data/providers/amusnet/amusnet";

export const AmusnetPage = () => {
    return <CasinoGrid games={amusnetGames}/>
}