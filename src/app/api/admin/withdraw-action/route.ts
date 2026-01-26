import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    try {
        const { id, status, comment } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ ok: false });
        }

        // 1️⃣ withdraw request
        const { data: withdraw } = await supabaseAdmin
            .from("withdraw_requests")
            .select("*")
            .eq("id", id)
            .single();

        if (!withdraw || withdraw.status !== "pending") {
            return NextResponse.json({ ok: false });
        }

        // 2️⃣ user
        const { data: user } = await supabaseAdmin
            .from("users")
            .select("balance")
            .eq("user_id", withdraw.user_id)
            .single();

        if (!user) {
            return NextResponse.json({ ok: false });
        }

        // 3️⃣ BALANCE ↓↓↓
        if (status === "approved") {
            const newBalance =
                Number(user.balance) - Number(withdraw.amount);

            if (newBalance < 0) {
                return NextResponse.json({ ok: false });
            }

            await supabaseAdmin
                .from("users")
                .update({ balance: newBalance })
                .eq("user_id", withdraw.user_id);
        }

        // 4️⃣ withdraw_requests
        await supabaseAdmin
            .from("withdraw_requests")
            .update({
                status,
                admin_comment: comment ?? null,
            })
            .eq("id", id);

        // 5️⃣ transactions — 🔥 ԱՅՍՆ ԷՐ ԲԱՑԱԿԱ
        await supabaseAdmin
            .from("transactions")
            .update({
                status,
                admin_comment: comment ?? null,
            })
            .eq("reference_id", withdraw.id); // 🔥 ՄԵԿԸ ՄԵԿ ԿԱՊ


        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("ADMIN WITHDRAW ERROR", err);
        return NextResponse.json({ ok: false });
    }
}
