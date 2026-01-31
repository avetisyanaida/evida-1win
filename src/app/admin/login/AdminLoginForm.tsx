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
        <div className={'admin-login-form'}>
            <h2>Admin Login</h2>
            <div className={'admin-login-form-inner'}>
                <label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {err && <p style={{ color: "red" }}>{err}</p>}
                <button className={'admin-login-form-btn'} onClick={login}>Մուտք</button>
            </div>
        </div>
    );
}
