"use client";

import { useState } from "react";

export default function AdminLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const login = async () => {
        setErr("");

        const res = await fetch("/api/admin-login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!data.ok) {
            setErr(data.error);
            return;
        }

        window.location.href = "/admin";
    };

    return (
        <div style={{ padding: 40, color: "white", margin: "auto" }}>
            <h2>Admin Login</h2>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: '20px',
                width: '400px',
                alignItems: "center",
                justifyContent: "center",
                margin: 'auto',
                backgroundColor: "white",
                borderRadius: '5px',
                padding: '30px',
            }}>
                <label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "300px", height: "40px", padding: "15px" }}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "300px", height: "40px", padding: "15px" }}
                    />
                </label>
                {err && <p style={{ color: "red" }}>{err}</p>}
                <button style={{
                    padding: "10px 30px",
                    borderRadius: "15px",
                    cursor: "pointer",
                }} onClick={login}>Մուտք</button>
            </div>
        </div>
    );
}
