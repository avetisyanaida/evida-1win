"use client";

import {useEffect, useState} from "react";
import {supabase} from "@/src/hooks/supabaseClient";

interface SavedCard {
    id: string;
    brand: string;
    last4: string;
}

type WithdrawMethod = "card" | "idram" | "telcell";


export default function Withdraw({onCloseAction,}: { onCloseAction: () => void }) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<WithdrawMethod>('card');
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        (async () => {
            const {data: u} = await supabase.auth.getUser();
            if (!u?.user) return;

            const {data} = await supabase
                .from("cards")
                .select("id, brand, last4")
                .eq("user_id", u.user.id);

            setCards(data || []);
            setSelectedCardId(data?.[0]?.id ?? null);
        })();
    }, []);

    const submitWithdraw = async () => {
        if (loading) return;

        const {data: session} = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;
        if (!userId) {
            alert("Not authorized");
            return;
        }

        const parsedAmount = Number(amount);
        if (!parsedAmount || parsedAmount <= 0) {
            alert("Մուտքագրիր ճիշտ գումար");
            return;
        }

        setLoading(true);

        try {
            // 1️⃣ withdraw backend (ստեղծում է withdraw_requests + transactions)
            const res = await fetch("/api/withdraw", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user_id: userId,
                    amount: parsedAmount,
                    method,
                    card_id: method === "card" ? selectedCardId : null,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                alert(json.error || "Կանխիկացման սխալ");
                return;
            }

            // 2️⃣ ❗ ՔՈ notify-ն — ՉԵՄ ՀԱՆԵԼ
            await fetch("/api/notify-withdraw", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    withdrawId: json.withdrawId ?? null,
                    userId,
                    amount: parsedAmount,
                    method,
                }),
            });

            alert("Կանխիկացման հարցումը ուղարկվեց");
            onCloseAction();
        } catch (e) {
            alert("Սերվերի սխալ");
        } finally {
            setLoading(false);
        }
    }
        return (
        <div className="withdraw">
            <h3>Կանխիկացում</h3>

            <select value={method} onChange={e => setMethod(e.target.value as WithdrawMethod)}>
                <option value="card">Քարտ</option>
                <option value="idram">Idram</option>
                <option value="telcell">Telcell</option>
            </select>

            {method === "card" && (
                <div className="cards">
                    {cards.map(c => (
                        <div
                            key={c.id}
                            className={`card ${selectedCardId === c.id ? "active" : ""}`}
                            onClick={() => setSelectedCardId(c.id)}
                        >
                            {c.brand} •••• {c.last4}
                        </div>
                    ))}
                </div>
            )}
            <label>
                <input
                    type="number"
                    placeholder="Գումար (AMD)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
            </label>
            <div className={'btn-withdraw'}>
                <button style={{
                    padding: "10px 30px",
                }} onClick={submitWithdraw}>Հաստատել
                </button>
                <button style={{
                    padding: "10px 30px",
                }} onClick={onCloseAction}>Փակել
                </button>
            </div>
            {msg && <p>{msg}</p>}
        </div>
    );
}

