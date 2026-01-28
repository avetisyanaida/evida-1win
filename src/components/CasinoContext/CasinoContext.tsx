"use client";

import React, { createContext, type ReactNode, useContext, useState } from "react";

interface CasinoContextType {
    showProviders: boolean;
    setShowProviders: React.Dispatch<React.SetStateAction<boolean>>;

    walletMode: boolean;
    setWalletMode: React.Dispatch<React.SetStateAction<boolean>>;

    openAttachCard: boolean;
    setOpenAttachCard: React.Dispatch<React.SetStateAction<boolean>>;

    openBonuses: boolean;
    setOpenBonuses: React.Dispatch<React.SetStateAction<boolean>>;

    showDeposit: boolean;
    setShowDeposit: React.Dispatch<React.SetStateAction<boolean>>;

    showBalance: boolean;
    setShowBalance: React.Dispatch<React.SetStateAction<boolean>>;

    showAttachCard: boolean;
    setShowAttachCard: React.Dispatch<React.SetStateAction<boolean>>

    showMoreInfo: boolean;
    showCardInfo: "card" | "idram" | null;

    showWithdraw: boolean;
    setShowWithdraw: React.Dispatch<React.SetStateAction<boolean>>;

    setShowCardInfo: React.Dispatch<
        React.SetStateAction<"card" | "idram" | null>
    >;    setShowMoreInfo: React.Dispatch<React.SetStateAction<boolean>>;

    showHistory: boolean;
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;

    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;

    showSignup: boolean;
    setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;

}


const CasinoContext = createContext<CasinoContextType | undefined>(undefined);

export const CasinoProvider = ({ children }: { children: ReactNode }) => {
    const [showProviders, setShowProviders] = useState(false);
    const [walletMode, setWalletMode] = useState(false);
    const [openAttachCard, setOpenAttachCard] = useState(false);
    const [showAttachCard, setShowAttachCard] = useState(false);
    const [openBonuses, setOpenBonuses] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [showCardInfo, setShowCardInfo] = useState<"card" | "idram" | null>(null);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);



    return (
        <CasinoContext.Provider
            value={{
                showProviders,
                setShowProviders,
                walletMode,
                setWalletMode,
                openAttachCard,
                setOpenAttachCard,
                openBonuses,
                setOpenBonuses,
                showBalance,
                setShowBalance,
                showDeposit,
                setShowDeposit,
                showAttachCard,
                setShowAttachCard,
                showCardInfo,
                showMoreInfo,
                setShowCardInfo,
                setShowMoreInfo,
                showWithdraw,
                setShowWithdraw,
                showHistory,
                setShowHistory,
                showLogin,
                setShowLogin,
                showSignup,
                setShowSignup,
            }}
        >
            {children}
        </CasinoContext.Provider>
    );
};

export const useCasino = () => {
    const context = useContext(CasinoContext);
    if (!context) {
        throw new Error("useCasino must be used within a CasinoProvider");
    }
    return context;
};
