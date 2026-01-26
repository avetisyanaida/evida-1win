import { NextResponse } from "next/server";
import { sendWithdrawTelegram } from "@/src/lib/telegram";

export async function POST(req: Request) {
    try {
        const { withdrawId, userId, amount, method } = await req.json();

        await sendWithdrawTelegram(
            withdrawId,
            userId,
            amount,
            method
        );

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("TELEGRAM NOTIFY ERROR:", err);
        return NextResponse.json({ ok: false });
    }
}
