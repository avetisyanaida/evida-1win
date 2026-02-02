"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {supabase} from "@/src/hooks/supabaseClient";

export default function MockPayment() {
    const [status, setStatus] = useState<"waiting" | "success" | "fail">("waiting");
    const [amount, setAmount] = useState<number | null>(null);
    const [provider, setProvider] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ Վերցնում ենք query parameter-ները URL-ից (?amount=1000&provider=idram)
    useEffect(() => {
        const amt = Number(searchParams.get("amount"));
        const prov = searchParams.get("provider");
        setAmount(amt || 0);
        setProvider(prov || "unknown");
    }, [searchParams]);

    const handlePayment = async (result: "success" | "fail") => {
        if (!amount) return;
        setLoading(true);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                alert("Մուտք գործիր նախքան վճարումը։");
                router.push("/");
                return;
            }

            const userId = session.user.id;

            if (result === "success") {
                const { error } = await supabase.rpc("increment_user_balance", {
                    _user_id: userId,
                    _amount: amount,
                });

                if (error) {
                    console.error(error);
                }
            }

            setStatus(result);
        } catch (err: any) {
            console.error("Mock payment error:", err.message);
            setStatus("fail");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <h2>Մշակվում է վճարումը...</h2>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <h2>✅ Վճարումը հաջողվեց!</h2>
                <p>
                    {amount} AMD փոխանցվեց քո հաշվին ({provider})։
                </p>
                <button
                    onClick={() => router.push("/profile")}
                    style={btnStyleGreen}
                >
                    Վերադառնալ պրոֆիլ
                </button>
            </div>
        );
    }

    if (status === "fail") {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <h2>❌ Վճարումը ձախողվեց</h2>
                <button
                    onClick={() => router.push("/profile/wallet")}
                    style={btnStyleRed}
                >
                    Կրկին փորձել
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: 100 }}>
            <h2>💳 Վճարման էջ (Mock)</h2>
            <p>Գումար՝ {amount} AMD</p>
            <p>Պրովայդեր՝ {provider}</p>

            <div
                style={{
                    marginTop: 40,
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                }}
            >
                <button
                    onClick={() => handlePayment("success")}
                    style={btnStyleGreen}
                >
                    ✔ Վճարումը հաջողվեց
                </button>
                <button
                    onClick={() => handlePayment("fail")}
                    style={btnStyleRed}
                >
                    ✖ Վճարումը ձախողվեց
                </button>
            </div>
        </div>
    );
}

// 🧱 Button styles
const btnStyleGreen = {
    padding: "10px 30px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
};

const btnStyleRed = {
    padding: "10px 30px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
};
