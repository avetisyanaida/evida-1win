"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/src/hooks/supabaseClient";
import { ModalComponent } from "@/src/components/ModalComponent/ModalComponent";

export default function Profile() {
    const [username, setUsername] = useState<string>("");
    const [uniqueId, setUniqueId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();

    const fetchBalance = async () => {
        try {
            setLoading(true);
            setShowVerificationModal(false);

            const { data: sessionData, error: sessionError } =
                await supabase.auth.getSession();

            if (sessionError) {
                console.error(sessionError);
                return;
            }

            const userId = sessionData?.session?.user?.id;
            if (!userId) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("balance, first_name, unique_id")
                .eq("user_id", userId)
                .maybeSingle();

            if (error) {
                console.error(error);
                return;
            }

            setUsername(data?.first_name ?? "User");
            setUniqueId(data?.unique_id ?? null);

            const { data: verifs, error: verErr } = await supabase
                .from("verifications")
                .select("status")
                .eq("user_id", userId);

            if (verErr) {
                console.error(verErr);
            }

            const allApproved =
                Array.isArray(verifs) &&
                verifs.length > 0 &&
                verifs.every((v) => v.status === "approved");

            const closed = localStorage.getItem("verificationModalClosed");
            const visited = localStorage.getItem("verificationModalVisited");

            if (!closed && !visited && !allApproved) {
                setShowVerificationModal(true);
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 ՀԻՄՆԱԿԱՆ ՖԻՔՍԸ ԱՅՍՏԵՂ Է
    useEffect(() => {
        fetchBalance();
    }, [searchParams]);

    const handleCloseModal = () => {
        localStorage.setItem("verificationModalClosed", "true");
        setShowVerificationModal(false);
    };

    const handleGoToVerification = () => {
        localStorage.setItem("verificationModalVisited", "true");
        setShowVerificationModal(false);
        router.push("/profile/verification");
    };

    if (loading) {
        return <p>Բեռնվում է․․․</p>;
    }

    return (
        <main>
            {showVerificationModal && (
                <ModalComponent
                    title={t("attention_title")}
                    onClose={handleCloseModal}
                >
                    <div className="modal-verification-notification">
                        <p>{t("attention_text")}</p>
                        <button onClick={handleGoToVerification}>
                            {t("verify_button")}
                        </button>
                    </div>
                </ModalComponent>
            )}
        </main>
    );
}
