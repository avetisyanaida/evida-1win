"use client";

import { CustomSelect } from "@/src/components/ui/CustomSelect";

interface LimitViewProps {
    t: (key: string) => string;
    isLimited: boolean;
    currentLimit: any;
    remainingMinutes: number;
    selectedDuration: number | null;
    settingLimit: boolean;
    onSelectDuration: (v: number | null) => void;
    onSetClick: () => void;
    onRemoveClick: () => void;
}

export default function LimitView({
                                      t,
                                      isLimited,
                                      currentLimit,
                                      remainingMinutes,
                                      selectedDuration,
                                      settingLimit,
                                      onSelectDuration,
                                      onSetClick,
                                      onRemoveClick,
                                  }: LimitViewProps) {
    if (isLimited && currentLimit) {
        return (
            <div className="status-active">
                <h3>⛔ {t("limit_active_title")}</h3>

                <p>
                    {t("limit_will_restore")}{" "}
                    {new Date(currentLimit.until).toLocaleString()}:
                </p>

                <p>
                    {t("limit_remaining")} <b>{remainingMinutes}</b>{" "}
                    {t("limit_minutes")}
                </p>

                <button
                    type="button"
                    style={{
                        background: "#c0392b",
                        marginTop: 15,
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: 5,
                    }}
                    onClick={onRemoveClick}
                >
                    🔓 {t("limit_remove_button")}
                </button>
            </div>
        );
    }

    return (
        <div className="status-setup">
            <h3>🕒 {t("limit_set_title")}</h3>
            <p>{t("limit_set_description")}</p>

            <CustomSelect
                className="custom-select-limits"
                name="limitDuration"
                value={selectedDuration ? String(selectedDuration) : ""}
                placeholder={t("limit_select_duration")}
                options={[
                    { value: String(24 * 60), label: t("limit_24h") },
                    { value: String(7 * 24 * 60), label: t("limit_1week") },
                    { value: String(30 * 24 * 60), label: t("limit_1month") },
                ]}
                onChange={(_, value) =>
                    onSelectDuration(value ? Number(value) : null)
                }
            />

            <button
                type="button"
                className="limited-btn"
                disabled={!selectedDuration || settingLimit}
                onClick={onSetClick}
                style={{ width: "100%", padding: 10 }}
            >
                {settingLimit ? "..." : `🔒 ${t("limit_set_button")}`}
            </button>
        </div>
    );
}
