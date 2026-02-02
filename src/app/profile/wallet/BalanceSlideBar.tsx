import { useTranslation } from "react-i18next";
import { useCasino } from "@/src/components/CasinoContext/CasinoContext";

export const BalanceSidebar = ({ isDesktop, handleLogout }: { isDesktop: boolean; handleLogout: () => void }) => {
    const { t } = useTranslation();
    const {
        setShowBalance, setShowDeposit, setShowHistory,
        setShowAttachCard, setOpenBonuses, setShowWithdraw
    } = useCasino();

    const resetViews = () => {
        setShowBalance(false);
        setShowDeposit(false);
        setShowHistory(false);
        setShowAttachCard(false);
        setOpenBonuses(false);
        setShowWithdraw(false);
    };

    return (
        <div className="balance-info-item">
            <div className="all-infos">
                <ul>
                    <li>
                        <button onClick={() => { resetViews(); setShowBalance(true); }}>
                            <i className="icon balance"></i> {!isDesktop && t("myBalance")}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { resetViews(); setShowDeposit(true); }}>
                            <i className="icon deposit"></i> {!isDesktop && t("deposit")}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { resetViews(); setShowWithdraw(true); }}>
                            <i className="icon withdraw"></i> {!isDesktop && t("withdraw")}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { resetViews(); setShowHistory(true); }}>
                            <i className="icon history"></i> {!isDesktop && t("history")}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { resetViews(); setShowAttachCard(true); }}>
                            <i className="icon card"></i> {!isDesktop && t("myCards")}
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLogout}>
                            <i className="icon log-out"></i> {!isDesktop && t("logout")}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};