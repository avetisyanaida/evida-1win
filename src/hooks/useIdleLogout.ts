"use client";

import {useRouter} from "next/navigation";
import {useEffect, useRef} from "react";
import {supabase} from "@/src/hooks/supabaseClient";

interface UserData {
    name: string;
    id: string;
}

export function useIdleLogout(
    isLoggedIn: boolean,
    setIsLoggedIn: (v: boolean) => void,
    setUserData: (v: UserData | null) => void,
) {
    const router = useRouter();
    const lastActivityRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!isLoggedIn) return;
        const INACTIVITY_LIMIT = 60 * 1000;
        const logoutUser = async () => {
            try {
                await supabase.auth.signOut();
            } catch (e) {
                console.error("Auto logout error:", e);
            } finally {
                setIsLoggedIn(false);
                setUserData(null);
                window.location.reload();
                router.push("/");
            }
        };

        const handleActivity = () => {
            const now = Date.now();
            const diff = now - lastActivityRef.current;

            if (diff > INACTIVITY_LIMIT) {
                logoutUser().then(r => r);
            } else {
                lastActivityRef.current = now;
            }
        };

        lastActivityRef.current = Date.now();

        window.addEventListener("click", handleActivity);
        window.addEventListener("keydown", handleActivity);

        return () => {
            window.removeEventListener("click", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, [isLoggedIn, router, setIsLoggedIn, setUserData]);
}