"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface WithdrawRow {
    id: string;
    user_id: string;
    amount: number;
    method: string;
    status: string;
    card_id?: string | null;
    admin_comment?: string | null;
    created_at: string;
}

export default function WithdrawAdmin() {
    const [rows, setRows] = useState<WithdrawRow[]>([]);
    const [comment, setComment] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("withdraw_requests")
            .select("*")
            .order("created_at", { ascending: false });

        setRows(data || []);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load().then(r => r);
    }, []);

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        const adminComment = comment[id] || "";

        const res = await fetch("/api/admin/withdraw-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                status,
                comment: adminComment,
            }),
        });

        const json = await res.json();
        if (!json.ok) {
            alert("Սխալ տեղի ունեցավ");
            return;
        }

        alert("Կարգավիճակը թարմացվեց");
        load().then(r => r);
    };

    if (loading) return <p style={{ color: "#aaa" }}>Բեռնվում է…</p>;

    return (
        <table className={'withdraw-table'}>
            <thead>
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {rows.map((r) => (
                <tr key={r.id}>
                    <td>{r.id.slice(0, 6)}…</td>
                    <td>{r.user_id.slice(0, 6)}…</td>
                    <td className="amount">{r.amount.toLocaleString()} AMD</td>
                    <td>{r.method}</td>
                    <td>
                        <span className={`status ${r.status}`}>{r.status}</span>
                    </td>

                    <td>
                        <input
                            className="comment-input"
                            value={comment[r.id] ?? ""}
                            onChange={(e) =>
                                setComment((p) => ({ ...p, [r.id]: e.target.value }))
                            }
                            placeholder="Admin comment"
                        />

                    </td>

                    <td>
                        {r.status === "pending" && (
                            <div className="actions">
                                <button
                                    className="approve"
                                    onClick={() => updateStatus(r.id, "approved")}
                                >
                                    ✔
                                </button>
                                <button
                                    className="reject"
                                    onClick={() => updateStatus(r.id, "rejected")}
                                >
                                    ✖
                                </button>
                            </div>
                        )}
                    </td>

                </tr>
            ))}
            </tbody>
        </table>
    );
}
