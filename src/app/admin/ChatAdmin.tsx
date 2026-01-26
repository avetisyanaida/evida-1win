"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface Message {
    id: number;
    user_id: string;
    email: string;
    message: string;
    sender: "user" | "admin" | "system";
    created_at: string;
}

export default function ChatAdmin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [reply, setReply] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // LOAD MESSAGES
    const loadMessages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: true });

        setMessages(data || []);
        setLoading(false);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    // GROUP BY USER
    const grouped = messages.reduce((acc: Record<string, Message[]>, msg) => {
        if (!acc[msg.user_id]) acc[msg.user_id] = [];
        acc[msg.user_id].push(msg);
        return acc;
    }, {});

    // SEND MESSAGE
    const sendMessage = async (uid: string, email: string) => {
        const text = reply[uid]?.trim();
        if (!text) return;

        await supabase.from("messages").insert([
            {
                user_id: uid,
                email,
                message: text,
                sender: "admin",
            },
        ]);

        setReply((prev) => ({ ...prev, [uid]: "" }));
        loadMessages();
    };

    // CLOSE CHAT
    const closeChat = async (uid: string) => {
        const ok = confirm("Փակե՞լ այս զրույցը։");
        if (!ok) return;

        await supabase.from("messages").delete().eq("user_id", uid);
        loadMessages();
    };

    if (loading) return <p style={{ color: "#aaa" }}>Բեռնվում է...</p>;

    return (
        <div>
            {Object.entries(grouped).length === 0 ? (
                <p style={{ color: "#aaa" }}>Չկան ակտիվ զրույցներ։</p>
            ) : (
                Object.entries(grouped).map(([uid, msgs]) => {
                    const email = msgs[0]?.email || "unknown";

                    return (
                        <div key={uid} style={chatBox}>
                            <h4>👤 {email !== "guest" ? email : `guest (${uid.slice(0, 6)})`}</h4>

                            <div style={chatArea}>
                                {msgs.map((m) => (
                                    <div
                                        key={m.id}
                                        style={{
                                            ...bubble,
                                            alignSelf:
                                                m.sender === "admin"
                                                    ? "flex-end"
                                                    : "flex-start",
                                            background:
                                                m.sender === "admin"
                                                    ? "#27ae60"
                                                    : "#444",
                                        }}
                                    >
                                        {m.message}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                    style={input}
                                    placeholder="Պատասխան..."
                                    value={reply[uid] || ""}
                                    onChange={(e) =>
                                        setReply((prev) => ({
                                            ...prev,
                                            [uid]: e.target.value,
                                        }))
                                    }
                                />
                                <button style={btnSend} onClick={() => sendMessage(uid, email)}>
                                    ✉️
                                </button>
                                <button style={btnClose} onClick={() => closeChat(uid)}>
                                    🔒
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

// STYLES
const chatBox = {
    background: "#111",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
};

const chatArea = {
    background: "#1b1b1b",
    padding: "10px",
    borderRadius: "8px",
    maxHeight: "230px",
    overflowY: "auto" as const,
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column" as const,
};

const bubble = {
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "6px",
    maxWidth: "80%",
    color: "#fff",
};

const input = {
    flex: 1,
    background: "#222",
    border: "1px solid #444",
    color: "#fff",
    padding: "8px",
    borderRadius: "6px",
};

const btnSend = {
    background: "#3498db",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
};

const btnClose = {
    background: "#c0392b",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
};
