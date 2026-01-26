import { useCallback, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

export const useBalance = () => {
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const fetchBalance = useCallback(async () => {
        setLoading(true);

        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;

        if (!userId) {
            setBalance(0);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("users")
            .select("balance")
            .eq("user_id", userId)
            .single();

        if (!error && data) {
            setBalance(Number(data.balance ?? 0));
        }

        setLoading(false);
    }, []);

    return {
        balance,
        loading,
        fetchBalance,
    };
};
