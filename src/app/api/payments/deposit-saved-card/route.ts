import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const { user_id, amount, card_id } = await req.json();

    if (!user_id || !amount || !card_id) {
        return NextResponse.json(
            { error: "Invalid payload" },
            { status: 400 }
        );
    }

    const { data: card } = await supabase
        .from("cards")
        .select("id")
        .eq("id", card_id)
        .eq("user_id", user_id)
        .maybeSingle();

    if (!card) {
        return NextResponse.json(
            { error: "Card not found" },
            { status: 400 }
        );
    }

    const { error: balErr } = await supabase.rpc("increment_balance", {
        p_user_id: user_id,
        p_amount: amount,
    });

    if (balErr) {
        return NextResponse.json(
            { error: balErr.message },
            { status: 400 }
        );
    }

    await supabase.from("transactions").insert({
        user_id,
        type: "deposit",
        amount,
        status: "approved",
        method: "card",
    });

    const { data: user } = await supabase
        .from("users")
        .select("balance")
        .eq("id", user_id)
        .single();

    return NextResponse.json({
        success: true,
        balance: user?.balance,
    });
}
