import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {noLimitCityGames} from "@/src/data/providers/noLimitCity/noLimitCity";

export const NoLimitCityPage = () => {
    return <CasinoGrid games={noLimitCityGames}/>
}