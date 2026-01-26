'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCasino } from "@/src/components/CasinoContext/CasinoContext";
import useBreakpoints from "@/src/hooks/useBreackPoints";
import { providerComponents } from "@/src/hooks/providerMap";
import { AllProviders } from "@/src/components/casino/AllProviders";
import { CasinoGrid } from "@/src/components/casino/CasinoGrid";
import { allCasinoGames } from "@/src/data/allCasinoGames";
import { useRouter, useSearchParams } from "next/navigation";

export const TabsComponent = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const search = useSearchParams();

    const urlProvider = search.get("provider");
    const { showProviders, setShowProviders } = useCasino();

    const [showAllProviders, setShowAllProviders] = useState(false);
    const { isDesktop } = useBreakpoints();

    const handleClickProvider = (prov: string) => {
        router.push(`?provider=${prov}`, { scroll: false });
        setShowAllProviders(false);
        setShowProviders(false);
    };


    const handleToggleAllProviders = () => {
        setShowAllProviders(prev => !prev);
        setShowProviders(false);
    };


    const SelectedProviderPage =
        urlProvider && providerComponents[urlProvider]
            ? providerComponents[urlProvider]
            : null;


    return (
        <section>
            <div className="container">
                <div className="tabs-component">

                    <button
                        onClick={handleToggleAllProviders}
                        className="providers-btn"
                    >
                        {t("tabs.providers")}
                        <i className={`icon ${showAllProviders ? "arrow-top" : "arrow-down"}`} />
                    </button>

                    {!isDesktop && (
                        <ul className="tabs-component-list">
                            <li><button onClick={() => handleClickProvider("Amusnet")}>Amusnet</button></li>
                            <li><button onClick={() => handleClickProvider("Pragmatic Play")}>Pragmatic Play</button></li>
                            <li><button onClick={() => handleClickProvider("Egt Digital")}>Egt Digital</button></li>
                            <li><button onClick={() => handleClickProvider("PlaySon")}>Playson</button></li>
                            <li><button onClick={() => handleClickProvider("Red Tiger")}>Red Tiger</button></li>
                            <li><button onClick={() => handleClickProvider("Push Gaming")}>Push Gaming</button></li>
                        </ul>
                    )}
                </div>

                {showAllProviders && (
                    <AllProviders onSelect={handleClickProvider} />
                )}

                {showProviders && (
                    <CasinoGrid games={allCasinoGames} />
                )}

                {!showProviders && !showAllProviders && SelectedProviderPage && (
                    <SelectedProviderPage />
                )}
            </div>
        </section>
    );
};
