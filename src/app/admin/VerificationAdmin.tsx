"use client";

import React, {useState} from "react";
import {supabase} from "@/src/hooks/supabaseClient";

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

export default function VerificationAdmin({data}: Props) {
    const [search, setSearch] = useState("");
    const [comment, setComment] = useState<Record<number, string>>({});

    const filtered = data.filter((f) =>
        JSON.stringify(f).toLowerCase().includes(search.toLowerCase())
    );

    const openFile = async (path: string) => {
        console.log("PATH:", path);

        const {data, error} = await supabase.storage
            .from("verification-docs")
            .createSignedUrl(path, 60 * 5);

        if (error) {
            console.error("SIGNED URL ERROR:", error);
            alert("Ֆայլը բացել չհաջողվեց");
            return;
        }

        window.open(data.signedUrl, "_blank");
    };

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
        <div className={'verification-admin'}>
            <input
                className={'search-input'}
                placeholder="Փնտրել…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className={'table'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Document</th>
                    <th>Preview</th>
                    <th>Status</th>
                    <th>Comment</th>
                    <th>Actions</th>
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
                                className={'preview-btn'}
                            >
                                Դիտել
                            </button>
                        </td>

                        <td style={td}>
                            {f.status === "pending" && (
                                <span className={'badge-pending'}>Pending</span>
                            )}
                            {f.status === "approved" && (
                                <span className={'badge-approved'}>Approved</span>
                            )}
                            {f.status === "rejected" && (
                                <span className={'badge-rejected'}>Rejected</span>
                            )}
                        </td>

                        <td style={td}>
                            <textarea
                                className={'comment-box'}
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
                                className={'approve-btn'}
                                onClick={() => updateStatus(f.id, "approved")}
                            >
                                ✔
                            </button>

                            <button
                                className={'reject-btn'}
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


const td = {
    padding: "10px",
    borderBottom: "1px solid #222",
    color: "#ccc",
};

const uid = {
    fontSize: "12px",
    color: "#777",
};