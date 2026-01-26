import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {supabase} from "@/src/hooks/supabaseClient";

interface BonusesProps {
    onClose: () => void;
}

interface Bonus {
    id: string;
    bonus_name: string;
    bonus_amount: number;
}

export const BonusDetails = ({ onClose }: BonusesProps) => {
    const [bonuses, setBonuses] = useState<Bonus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation(); // ✅ Թարգմանության hook

    useEffect(() => {
        const fetchBonuses = async () => {
            try {
                setLoading(true);

                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setError(t("loginRequired"));
                    setLoading(false);
                    return;
                }

                const { data } = await supabase
                    .from("bonuses")
                    .select("id, bonus_name, bonus_amount")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                setBonuses(data || []);
            } catch (err: any) {
                setError(err.message || t("bonusLoadError"));
            } finally {
                setLoading(false);
            }
        };

        fetchBonuses().then(r => r);
    }, [t]);

    return (
        <div className="attach-card-modal">
            <div className="attach-card-content">
                <h2>🎁 {t("myBonuses")}</h2>

                {error && <p style={{ color: "red" }}></p>}

                {loading ? (
                    <p className="fade-text">{t("loading")}</p>
                ) : bonuses.length === 0 ? (
                    <p className="fade-text">{t("noBonusesFound")}</p>
                ) : (
                    <ul className="bonus-list fade-in">
                        {bonuses.map((bonus) => (
                            <li key={bonus.id} className="bonus-item">
                                <strong>{bonus.bonus_name}</strong> —{" "}
                                {bonus.bonus_amount.toLocaleString()} AMD
                            </li>
                        ))}
                    </ul>
                )}

                <button className="close-btn" onClick={onClose}>
                    {t("close")}
                </button>
            </div>
        </div>
    );
};
