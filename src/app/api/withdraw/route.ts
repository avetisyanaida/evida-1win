import { NextResponse } from "next/server";
import {supabaseAdmin} from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { user_id, amount, method, card_id } = await req.json();
        const parsedAmount = Number(amount);

        if (!user_id || !parsedAmount || parsedAmount <= 0 || !method) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 1️⃣ balance check
        const { data: user, error: uErr } = await supabaseAdmin
            .from("users")
            .select("balance")
            .eq("user_id", user_id)
            .single();

        if (uErr || !user || Number(user.balance) < parsedAmount) {
            return NextResponse.json(
                { error: "Insufficient balance" },
                { status: 400 }
            );
        }

        // 2️⃣ withdraw request
        const { data: withdraw, error: wErr } = await supabaseAdmin
            .from("withdraw_requests")
            .insert({
                user_id,
                amount: parsedAmount,
                method,
                card_id: method === "card" ? card_id : null,
                status: "pending",
            })
            .select()
            .single();

        if (wErr || !withdraw) {
            console.error("WITHDRAW INSERT ERROR:", wErr);
            return NextResponse.json(
                { error: "Withdraw create failed" },
                { status: 500 }
            );
        }

        // 3️⃣ transaction (🔥 reference կապ)
        const { error: txErr } = await supabaseAdmin
            .from("transactions")
            .insert({
                user_id,
                type: "withdraw",
                amount: parsedAmount,
                status: "pending",
                method,
                reference_id: withdraw.id,
            });

        if (txErr) {
            console.error("TX INSERT ERROR:", txErr);
            return NextResponse.json(
                { error: "Transaction create failed" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, withdrawId: withdraw.id });
    } catch (err) {
        console.error("WITHDRAW API CRASH:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
