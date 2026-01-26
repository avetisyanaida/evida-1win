"use client";

import React, { useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface VerificationRow {
    id: number;
    user_id: string;
    document_url: string;
    document_type: string;
    status: string;
    admin_comment?: string;
    first_name?: string;
    last_name?: string;
}

interface Props {
    data: VerificationRow[];
}

export default function VerificationAdmin({ data }: Props) {
    const [search, setSearch] = useState("");
    const [comment, setComment] = useState<Record<number, string>>({});

    // 🔍 FILTER
    const filtered = data.filter((f) =>
        JSON.stringify(f).toLowerCase().includes(search.toLowerCase())
    );

    // 📌 Signed URL preview
    const openFile = async (path: string) => {
        console.log("PATH:", path);

        const { data, error } = await supabase.storage
            .from("verification-docs")
            .createSignedUrl(path, 60 * 5);

        if (error) {
            console.error("SIGNED URL ERROR:", error);
            alert("Ֆայլը բացել չհաջողվեց");
            return;
        }

        window.open(data.signedUrl, "_blank");
    };

    // 🔥 UPDATE STATUS (Approve / Reject)
    const updateStatus = async (id: number, newStatus: string) => {
        const commentText = comment[id] || "";

        const res = await fetch("/api/admin/updateVerification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                status: newStatus,
                comment: commentText
            })
        });

        const result = await res.json();

        if (!result.success) {
            alert("❌ Սխալ: " + result.error);
            return;
        }

        alert("✔ Կարգավիճակը փոխվեց հաջողությամբ!");
        window.location.reload();
    };

    return (
        <div>
            {/* Search */}
            <input
                style={searchInput}
                placeholder="Փնտրել…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table style={table}>
                <thead>
                <tr>
                    <th style={th}>#</th>
                    <th style={th}>User</th>
                    <th style={th}>Document</th>
                    <th style={th}>Preview</th>
                    <th style={th}>Status</th>
                    <th style={th}>Comment</th>
                    <th style={th}>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filtered.map((f, i) => (
                    <tr key={f.id}>
                        <td style={td}>{i + 1}</td>

                        <td style={td}>
                            <b>{f.first_name} {f.last_name}</b>
                            <div style={uid}>{f.user_id.slice(0, 8)}…</div>
                        </td>

                        <td style={td}>{f.document_type}</td>

                        <td style={td}>
                            <button
                                onClick={() => openFile(f.document_url)}
                                style={previewBtn}
                            >
                                Դիտել
                            </button>
                        </td>

                        <td style={td}>
                            {f.status === "pending" && (
                                <span style={badgePending}>Pending</span>
                            )}
                            {f.status === "approved" && (
                                <span style={badgeApproved}>Approved</span>
                            )}
                            {f.status === "rejected" && (
                                <span style={badgeRejected}>Rejected</span>
                            )}
                        </td>

                        <td style={td}>
                            <textarea
                                style={commentBox}
                                placeholder="Admin comment..."
                                value={comment[f.id] ?? f.admin_comment ?? ""}
                                onChange={(e) =>
                                    setComment((prev) => ({
                                        ...prev,
                                        [f.id]: e.target.value,
                                    }))
                                }
                            />
                        </td>

                        <td style={td}>
                            <button
                                style={approveBtn}
                                onClick={() => updateStatus(f.id, "approved")}
                            >
                                ✔
                            </button>

                            <button
                                style={rejectBtn}
                                onClick={() => updateStatus(f.id, "rejected")}
                            >
                                ✖
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

/* 🎨 STYLES */

const searchInput = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "white",
};

const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#111",
    borderRadius: "8px",
    overflow: "hidden",
};

const th = {
    padding: "12px",
    background: "#1a1a1a",
    borderBottom: "1px solid #333",
    textAlign: "left" as const,
    fontWeight: "bold",
    color: "#ddd",
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #222",
    color: "#ccc",
};

const uid = {
    fontSize: "12px",
    color: "#777",
};

const previewBtn = {
    padding: "6px 12px",
    background: "#2980b9",
    borderRadius: "6px",
    color: "white",
};

const badgePending = {
    background: "#f39c12",
    padding: "4px 10px",
    borderRadius: "6px",
    color: "black",
    fontWeight: "bold",
};

const badgeApproved = {
    background: "#2ecc71",
    padding: "4px 10px",
    borderRadius: "6px",
    color: "black",
    fontWeight: "bold",
};

const badgeRejected = {
    background: "#e74c3c",
    padding: "4px 10px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
};

const approveBtn = {
    padding: "8px 12px",
    background: "#27ae60",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px",
    color: "white",
    border: "none",
};

const rejectBtn = {
    padding: "8px 12px",
    background: "#c0392b",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    border: "none",
};

const commentBox = {
    width: "150px",
    height: "60px",
    background: "#1a1a1a",
    border: "1px solid #333",
    color: "white",
    borderRadius: "6px",
    padding: "6px",
};
