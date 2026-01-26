import {AmusnetPage} from "@/src/data/providers/amusnet/AmusnetPage";
import {AmusnetEgyptQuestPage} from "@/src/data/providers/amusnetEgyptQuest/AmusnetEgyptQuestPage";
import {EgtDigitalPage} from "@/src/data/providers/egtDigital/EgtDigitalPage";
import {MicroGamingPage} from "@/src/data/providers/microGaming/MicroGamingPage";
import {NetentPage} from "@/src/data/providers/netent/NetentPage";
import {NoLimitCityPage} from "@/src/data/providers/noLimitCity/NoLimitCityPage";
import {NovomaticPage} from "@/src/data/providers/novomatic/NovomaticPage";
import {PlaynGoPage} from "@/src/data/providers/playnGo/PlaynGoPage";
import {PlaysonPage} from "@/src/data/providers/playson/PlaysonPage";
import {PlaytechPage} from "@/src/data/providers/playtech/PlaytechPage";
import {PragmaticPage} from "@/src/data/providers/pragmatic/PragmaticPage";
import {PushGamingPage} from "@/src/data/providers/pushGaming/PushGamingPage";
import {RedTigerPage} from "@/src/data/providers/redTiger/RedTigerPage";
import {SoftBetPage} from "@/src/data/providers/softBet/SoftBetPage";
import {YggdrasilPage} from "@/src/data/providers/yggdrasil/YggdrasilPage";
import {NetGamingPage} from "@/src/data/providers/netGaming/NetGamingPage";
import React from "react";

export const providerComponents: Record<string, React.FC> = {
    Amusnet: AmusnetPage,
    "Amusnet Egypt Quest": AmusnetEgyptQuestPage,
    "Egt Digital": EgtDigitalPage,
    MicroGaming: MicroGamingPage,
    Netent: NetentPage,
    Netgaming: NetGamingPage,
    "NoLimit City": NoLimitCityPage,
    Novomatic: NovomaticPage,
    "Playn Go": PlaynGoPage,
    PlaySon: PlaysonPage,
    Playtech: PlaytechPage,
    "Pragmatic Play": PragmaticPage,
    "Push Gaming": PushGamingPage,
    "Red Tiger": RedTigerPage,
    SoftBet: SoftBetPage,
    Yggdrasil: YggdrasilPage,
};
