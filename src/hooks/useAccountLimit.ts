"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

export interface LimitRow {
    user_id: string;
    until: string;
}

export interface AccountLimitHook {
    currentLimit: LimitRow | null;
    loading: boolean;
    isLimited: boolean;
    setLimit: (minutes: number) => Promise<boolean>;
    removeLimit: (id?: string) => Promise<void>;
    init: () => Promise<void>;
}

export const useAccountLimit = (): AccountLimitHook => {
    const [currentLimit, setCurrentLimit] = useState<LimitRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const isLimited =
        currentLimit ? new Date(currentLimit.until) > new Date() : false;

    const removeLimit = useCallback(
        async (id?: string) => {
            const uid = id || userId;
            if (!uid) return;
            await supabase.from("account_limits").delete().eq("user_id", uid);
            setCurrentLimit(null);
        },
        [userId]
    );

    const fetchLimit = useCallback(
        async (id: string) => {
            const { data } = await supabase
                .from("account_limits")
                .select("*")
                .eq("user_id", id)
                .maybeSingle<LimitRow>();

            if (!data) {
                setCurrentLimit(null);
                return;
            }

            const now = new Date();
            const untilDate = new Date(data.until);

            if (untilDate > now) {
                setCurrentLimit(data);
            } else {
                await removeLimit(id);
            }
        },
        [removeLimit]
    );

    const init = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        if (!data?.user) {
            setLoading(false);
            return;
        }
        setUserId(data.user.id);
        await fetchLimit(data.user.id);
        setLoading(false);
    }, [fetchLimit]);

    const setLimit = useCallback(
        async (minutes: number) => {
            if (!userId) return false;

            const until = new Date(
                Date.now() + minutes * 60 * 1000
            ).toISOString();

            const { error } = await supabase
                .from("account_limits")
                .upsert(
                    {
                        user_id: userId,
                        limit_type: "time",
                        amount: 0,
                        until,
                    },
                    { onConflict: "user_id" }
                );

            if (!error) {
                setCurrentLimit({ user_id: userId, until });
            }

            return !error;
        },
        [userId]
    );
    return { currentLimit, loading, isLimited, setLimit, removeLimit, init };
};
