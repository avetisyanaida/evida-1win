'use client';

import { useTranslation } from "react-i18next";
import React from "react";
import useBreakpoints from "../../hooks/useBreackPoints";
import {useCasino} from "@/src/components/CasinoContext/CasinoContext";
import {useRouter} from "next/navigation";

export const HeaderMenu = () => {
    const { setShowProviders } = useCasino();
    const { t } = useTranslation();
    const {isTabletLarge} = useBreakpoints();
    const router = useRouter();

    const handleClickCasino = (prov: string) => {
        setShowProviders(true);
        router.push(`?provider=${prov}`, { scroll: false });
    };

    return (
        <div className="header-menu">
            <div className="container">
                {!isTabletLarge ? (
                    <ul>
                        <li>
                            <button onClick={() => handleClickCasino("allGames")}>
                                {t("casino")}
                            </button>
                        </li>
                        <li><button>{t("liveCasino")}</button></li>
                        <li><button>{t("tvGames")}</button></li>
                        <li><button>{t("casinoTour")}</button></li>
                        <li><button>{t("blot")}</button></li>
                        <li><button>{t("balloon")}</button></li>
                        <li><button>{t("tournaments")}</button></li>
                        <li><button>{t("promo")}</button></li>
                    </ul>
                ): null}
            </div>
        </div>
    );
};
