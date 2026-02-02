import { useTranslation } from "react-i18next";

export const WalletSummary = ({ balance }: { balance: number }) => {
    const { t } = useTranslation();
    return (
        <div className="wallet-info">
            <ul>
                <li>
                    {t("balance")}
                    <p>{balance.toLocaleString("de-DE")} {t("money")}</p>
                </li>
                <li>
                    {t("bonusBalance")}
                    <p>0 {t("money")}</p>
                </li>
            </ul>
        </div>
    );
};