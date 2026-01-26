import { useCallback, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

const PAGE_SIZE = 10;

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchTransactions = useCallback(async (pageNum: number = 1) => {
        setLoading(true);

        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;

        if (!userId) {
            setTransactions([]);
            setHasMore(false);
            setLoading(false);
            return;
        }

        const from = (pageNum - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, count, error } = await supabase
            .from("transactions")
            .select("*", { count: "exact" })
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error) {
            setTransactions(data ?? []);
            setPage(pageNum);
            setHasMore((count ?? 0) > pageNum * PAGE_SIZE);
        }

        setLoading(false);
    }, []);

    return {
        transactions,
        loading,
        page,
        hasMore,
        fetchTransactions,
        nextPage: () => fetchTransactions(page + 1),
        prevPage: () => fetchTransactions(page - 1),
    };
};
