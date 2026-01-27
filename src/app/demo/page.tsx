"use client";

import { useEffect, useState } from "react";

export default function DemoGamePage() {
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/choice/demo", { method: "POST" })
            .then(res => res.json())
            .then(data => {
                console.log("CHOICE RESPONSE:", data);

                const launcher =
                    data?.data?.launcherURL || data?.launcherURL || null;

                if (!launcher) {
                    setError("Launcher URL not received");
                    return;
                }

                setUrl(launcher);
            })
            .catch(() => setError("API error"));
    }, []);

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!url) {
        return <p>Loading demo game…</p>;
    }

    return (
        <iframe
            src={url}
            width="100%"
            height="800"
            frameBorder="0"
            allowFullScreen
        />
    );
}
