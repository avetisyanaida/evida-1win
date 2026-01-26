import {CasinoGrid} from "@/src/components/casino/CasinoGrid";
import {amusnetEgyptQuestGames} from "@/src/data/providers/amusnetEgyptQuest/amusnetEgyptQuest";

export const AmusnetEgyptQuestPage = () => {
    return <CasinoGrid games={amusnetEgyptQuestGames}/>
}