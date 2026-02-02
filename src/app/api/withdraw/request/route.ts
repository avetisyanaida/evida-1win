import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.json();
    const { user_id, amount, method, card_id } = body;

    const parsedAmount = Number(amount);

    if (!user_id || !parsedAmount || parsedAmount <= 0 || !method) {
        return NextResponse.json(
            { error: "Invalid payload" },
            { status: 400 }
        );
    }

    const { data: user, error: uErr } = await supabase
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

    const { data: withdraw, error: wErr } = await supabase
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
        return NextResponse.json(
            { error: wErr?.message ?? "Withdraw create failed" },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}
