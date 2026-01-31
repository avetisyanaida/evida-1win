"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface Message {
    id?: number;
    message: string;
    sender: "user" | "admin" | "system";
    created_at?: string;
    closed?: boolean;
}

export const ChatUser = () => {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState("");
    const [chatClosed, setChatClosed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email ?? "guest",
                });
            }
        };
        loadUser();
    }, []);

    const loadMessages = async (uid: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: true });

        if (!error) setMessages(data || []);
    };

    useEffect(() => {
        if (!user?.id) return;
        loadMessages(user.id);
    }, [user?.id]);

    const sendMsg = async () => {
        if (!newMsg.trim() || !user?.id || chatClosed) return;

        const text = newMsg.trim();
        setNewMsg("");

        const localMessage: Message = {
            message: text,
            sender: "user",
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, localMessage]);

        const { error } = await supabase.from("messages").insert([
            {
                user_id: user.id,
                email: user.email || "guest",
                message: text,
                sender: "user",
            },
        ]);

        if (error) console.error("Send error:", error);
    };

    const closeChat = async () => {
        if (!user?.id) return;

        await supabase.from("messages").insert([
            {
                user_id: user.id,
                email: user.email,
                message: "🔒 Զրույցը փակվել է օգտատիրոջ կողմից",
                sender: "system",
                closed: true,
            },
        ]);

        await supabase
            .from("messages")
            .insert([
                {
                    user_id: user.id,
                    email: user.email,
                    message: "🔒 Զրույցը փակվել է օգտատիրոջ կողմից",
                    sender: "system",
                    closed: true,
                },
            ]);

        setMessages([]);
        setChatClosed(true);
    };

    if (!isOpen) {
        return (
            <button
                className={'floating-btn'}
                onClick={() => setIsOpen(true)}
            >
                💬
            </button>
        );
    }

    return (
        <div className={'chat-wrapper'}>
            <div className={'chat-wrapper-content'}>
                <h4>💬 Support Chat</h4>
                <button className={'chat-wrapper-btn-close'} onClick={() => setIsOpen(false)}>✖</button>
            </div>

            <div className={'chat-wrapper-messages'}>
                {messages.length === 0 ? (
                    <p style={{ color: "#888", textAlign: "center" }}>
                        Գրիր հաղորդագրություն 👇
                    </p>
                ) : (
                    messages.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.msg,
                                alignSelf:
                                    m.sender === "user" ? "flex-end" : "flex-start",
                                background:
                                    m.sender === "user"
                                        ? "#18133BFF"
                                        : m.sender === "admin"
                                            ? "#444"
                                            : "transparent",
                            }}
                        >
                            <p>{m.message}</p>
                            {m.sender !== "system" && m.created_at && (
                                <span style={styles.time}>
                                    {new Date(m.created_at).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>

            {!chatClosed && (
                <>
                    <div className={'input-row'}>
                        <input
                            value={newMsg}
                            onChange={(e) => setNewMsg(e.target.value)}
                            placeholder="Գրիր հաղորդագրություն..."
                            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                        />
                        <button onClick={sendMsg} className={'send-button'}>
                            📤
                        </button>
                    </div>

                    <button onClick={closeChat} className={'end-button'}>
                        🔒 Փակել զրույցը
                    </button>
                </>
            )}
        </div>
    );
};

const styles = {
    msg: {
        maxWidth: "70%",
        padding: "8px 10px",
        borderRadius: 8,
        color: "#fff",
    },
    time: { fontSize: 10, opacity: 0.6 },
};
