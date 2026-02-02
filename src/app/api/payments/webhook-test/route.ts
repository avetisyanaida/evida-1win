import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    const body = await req.json();

    const { user_id, amount, provider, card } = body;

    if (!user_id || !amount) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }


    const { error: balErr } = await supabaseAdmin.rpc("increment_balance", {
        p_user_id: user_id,
        p_amount: amount,
    });

    if (balErr) {
        console.error("❌ BALANCE ERROR:", balErr);
        return NextResponse.json({ error: balErr.message }, { status: 500 });
    }

    if (card?.last4) {
        await supabaseAdmin.from("cards").insert({
            user_id,
            provider,
            brand: card.brand,
            last4: card.last4,
        });
    }

    const { data: tx, error: txErr } = await supabaseAdmin
        .from("transactions")
        .insert({
            user_id,
            type: "deposit",
            amount,
            status: "approved",
            method: provider,
        })
        .select()
        .single();

    if (txErr) {
        console.error("❌ TRANSACTION INSERT ERROR:", txErr);
        return NextResponse.json(
            { error: txErr.message },
            { status: 500 }
        );
    }
    console.log("✅ TRANSACTION CREATED:", tx);

    return NextResponse.json({ success: true });
}
