import { useCasino } from "@/src/components/CasinoContext/CasinoContext";
import { useTransactions } from "@/src/hooks/useTransactions";
import { useEffect } from "react";
import { supabase } from "@/src/hooks/supabaseClient";
import { RealtimeChannel } from "@supabase/realtime-js";

export const TransactionHistory = () => {
    const { showHistory } = useCasino();

    const {
        transactions,
        loading,
        page,
        hasMore,
        fetchTransactions,
        nextPage,
        prevPage,
    } = useTransactions();


    useEffect(() => {
        if (!showHistory) return;

        let channel: RealtimeChannel | null = null;

        const init = async () => {
            await fetchTransactions(1);

            const { data: session } = await supabase.auth.getSession();
            const userId = session?.session?.user?.id;
            if (!userId) return;

            channel = supabase
                .channel(`transactions-user-${userId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "transactions",
                        filter: `user_id=eq.${userId}`,
                    },
                    () => {
                        fetchTransactions(1);
                    }
                )
                .subscribe();
        };

        void init();

        return () => {
            if (channel) {
                void supabase.removeChannel(channel);
            }
        };
    }, [showHistory, fetchTransactions]);

    if (loading) return <p>Բեռնվում է…</p>;
    if (!transactions.length) return <p style={{color: 'white'}}>Դեռ գործարքներ չկան</p>;

    return (
        <div className="tx-table-wrap">
            <h2>Գործարքների պատմություն</h2>

            <table className="tx-table">
                <thead>
                <tr>
                    <th>Տեսակ</th>
                    <th>Գումար</th>
                    <th>Մեթոդ</th>
                    <th>Կարգավիճակ</th>
                    <th>Ամսաթիվ</th>
                </tr>
                </thead>

                <tbody>
                {transactions.map((tx) => (
                    <tr key={tx.id}>
                        <td data-label="Տեսակ">
                            {tx.type === "deposit" ? "Լիցքավորում" : "Կանխիկացում"}
                        </td>

                        <td data-label="Գումար">
                            {tx.amount.toLocaleString()} ֏
                        </td>

                        <td data-label="Մեթոդ">
                            {tx.method === "card"
                                ? "Քարտ"
                                : tx.method === "idram"
                                    ? "Idram"
                                    : "Telcell"}
                        </td>

                        <td data-label="Կարգավիճակ">
                            <span className={`status ${tx.status}`}>
                                {tx.status === "pending"
                                    ? "Մշակվում է"
                                    : tx.status === "approved"
                                        ? "Հաստատված"
                                        : "Մերժված"}
                            </span>
                        </td>

                        <td data-label="Ամսաթիվ">
                            {new Date(tx.created_at).toLocaleString("hy-AM")}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
                <button
                    style={{
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                    disabled={page === 1}
                    onClick={prevPage}
                >
                    ⬅ Նախորդ
                </button>

                <span
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: 'white'
                    }}
                >Էջ {page}</span>

                <button
                    style={{
                        padding: '5px',
                        borderRadius: '5px',
                    }}
                    disabled={!hasMore}
                    onClick={nextPage}
                >
                    Հաջորդ ➡
                </button>
            </div>
        </div>
    );
};
