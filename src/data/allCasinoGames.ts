import {amusnetGames} from "@/src/data/providers/amusnet/amusnet";
import {amusnetEgyptQuestGames} from "@/src/data/providers/amusnetEgyptQuest/amusnetEgyptQuest";
import {egtDigitalGames} from "@/src/data/providers/egtDigital/egtDigital";
import {microGamingGames} from "@/src/data/providers/microGaming/microGaming";
import {netEntGames} from "@/src/data/providers/netent/netent";
import {netGamingGames} from "@/src/data/providers/netGaming/netGaming";
import {noLimitCityGames} from "@/src/data/providers/noLimitCity/noLimitCity";
import {novomaticGames} from "@/src/data/providers/novomatic/novomatic";
import {playnGoGames} from "@/src/data/providers/playnGo/playnGo";
import {playsonGames} from "@/src/data/providers/playson/playson";
import {playtechGames} from "@/src/data/providers/playtech/playtech";
import {pragmaticGames} from "@/src/data/providers/pragmatic/pragmatic";
import {pushGamingGames} from "@/src/data/providers/pushGaming/pushGaming";
import {redTigerGames} from "@/src/data/providers/redTiger/redTiger";
import {softBetGames} from "@/src/data/providers/softBet/softBet";
import {yggdrasilGames} from "@/src/data/providers/yggdrasil/yggdrasil";

export const allCasinoGames = [
    ...amusnetGames,
    ...amusnetEgyptQuestGames,
    ...egtDigitalGames,
    ...microGamingGames,
    ...netEntGames,
    ...netGamingGames,
    ...noLimitCityGames,
    ...novomaticGames,
    ...playnGoGames,
    ...playsonGames,
    ...playtechGames,
    ...pragmaticGames,
    ...pushGamingGames,
    ...redTigerGames,
    ...softBetGames,
    ...yggdrasilGames
]