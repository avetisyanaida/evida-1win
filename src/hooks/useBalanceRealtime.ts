import { useEffect } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

export const useBalanceRealtime = (
    userId: string | null,
    refreshBalance: () => void
) => {
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`user-balance-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "users",
                    filter: `user_id=eq.${userId}`,
                },
                () => {
                    refreshBalance();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, refreshBalance]);
};
