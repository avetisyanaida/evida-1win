"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface UserData {
    name: string;
    id: string;
}

export function useAuthUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const path = window.location.pathname;
        const isAuthActionPage = path.includes("/reset") || path.includes("/profile/personal-details");

        if (isAuthActionPage) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!isMounted) return;

                if (!session?.user) {
                    setIsLoggedIn(false);
                    setLoading(false);
                    return;
                }

                // 🛑 ՈՒՇԱԴՐՈՒԹՅՈՒՆ. Միայն եթե սեսիան կա, նոր փորձիր բեռնել պրոֆիլը
                const { data: row } = await supabase
                    .from("users")
                    .select("first_name, unique_id")
                    .eq("user_id", session.user.id)
                    .maybeSingle();

                if (isMounted) {
                    setIsLoggedIn(true);
                    setUserData({
                        name: row?.first_name || "User",
                        id: row?.unique_id || "",
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load().then(r => r);

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setIsLoggedIn(false);
                setUserData(null);
            }
        });

        return () => {
            isMounted = false;
            listener?.subscription?.unsubscribe();
        };
    }, []); // Dependency array-ը թող մնա դատարկ

    return { isLoggedIn, userData, loading };
}