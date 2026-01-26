import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {egtDigitalGames} from "@/src/data/providers/egtDigital/egtDigital";

export const EgtDigitalPage = () => {
    return <CasinoGrid games={egtDigitalGames}/>
}