import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {supabase} from "@/src/hooks/supabaseClient";
import type { VerificationUser } from "@/src/types/verification";

interface VerifyPhoneProps {
    user: VerificationUser | null;
}


export const VerifyPhone = ({ user }: VerifyPhoneProps) => {
    const { t } = useTranslation();
    const [userId, setUserId] = useState<string | null>(null);
    const [phone, setPhone] = useState(user?.phone || "");
    const [code, setCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(user?.verifiedPhone || false);

    useEffect(() => {
        const getAuthUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) return;
            const id = data.user.id;
            setUserId(id);

            const { data: dbData, error: dbError } = await supabase
                .from("users")
                .select("phone, phone_verified")
                .eq("user_id", id)
                .maybeSingle();

            if (!dbError && dbData) {
                setPhone(dbData.phone || "");
                setVerified(dbData.phone_verified || false);
            }
        };

        getAuthUser().then(r => r);
    }, []);

    // ✅ Ուղարկում է OTP
    const sendOtp = async () => {
        if (!phone) {
            alert(t("phone_enter_number"));
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ phone });

        if (error) alert(t("phone_send_error") + " " + error.message);
        else {
            alert(t("phone_otp_sent"));
            setOtpSent(true);
        }
        setLoading(false);
    };

    // ✅ Ստուգում է OTP
    const verifyOtp = async () => {
        if (!code) {
            alert(t("phone_enter_code"));
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token: code,
            type: "sms",
        });

        if (error) {
            alert(t("phone_wrong_code"));
            setLoading(false);
            return;
        }

        if (data?.session && userId) {
            alert(t("phone_verified_success"));

            const { error: updateError } = await supabase
                .from("users")
                .update({
                    phone,
                    phone_verified: true,
                })
                .eq("user_id", userId);

            if (updateError) console.error("DB update error:", updateError);

            await supabase.auth.updateUser({
                data: { phone_verified: true },
            });

            setTimeout(() => {
                setVerified(true);
                setOtpSent(false);
                setCode("");
            }, 1500);
        }

        setLoading(false);
    };

    return (
        <div className="verify-phone verify">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="icon-file">
                    <i className="icon phone"></i>
                    <p>{t("phone_label")}</p>
                </div>

                {verified ? (
                    <p style={{ color: "white" }}>✅ {t("phone_verified_text")}</p>
                ) : (
                    <p style={{ color: "orange" }}>⚠️ {t("phone_not_verified_text")}</p>
                )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                <label>
                    <p>{t("phone_label")}</p>
                    <input
                        type="tel"
                        value={phone}
                        placeholder="+374"
                        onChange={(e) => setPhone(e.target.value)}
                        readOnly={verified}
                    />
                    {!verified ? <i>⚠️</i> : <i>✅</i>}
                </label>

                {!otpSent && !verified ? (
                    <button onClick={sendOtp} disabled={loading}>
                        {loading ? t("phone_sending") : t("phone_send_code")}
                    </button>
                ) : !verified ? (
                    <>
                        <label>
                            <p>{t("phone_code_label")}</p>
                            <input
                                type="text"
                                value={code}
                                placeholder={t("phone_code_placeholder")}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </label>
                        <button onClick={verifyOtp} disabled={loading}>
                            {loading ? t("phone_checking") : t("phone_confirm")}
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};
