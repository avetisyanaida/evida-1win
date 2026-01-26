import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // եթե callback_query չկա՝ ուղղակի OK
        if (!body.callback_query) {
            return NextResponse.json({ ok: true });
        }

        const callback = body.callback_query;

        const chatId = callback.message?.chat?.id?.toString();
        if (chatId !== process.env.TELEGRAM_ADMIN_CHAT_ID) {
            return NextResponse.json({ ok: true });
        }

        const data = callback.data;
        if (!data || !data.includes(":")) {
            return NextResponse.json({ ok: true });
        }

        const [action, withdrawId] = data.split(":");

        // 🔥 ՔԱՆԻ ՈՐ DEV ԵՆՔ, ՍՏՈՒԳ HTTP LOCALHOST
        await fetch("http://localhost:3000/api/admin/withdraw-action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: withdrawId,
                status: action === "approve" ? "approved" : "rejected",
                comment: "Telegram action",
            }),
        });

        // ✏️ Փոփոխում ենք Telegram message-ը
        await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: callback.message.chat.id,
                    message_id: callback.message.message_id,
                    text:
                        action === "approve"
                            ? `✅ Հաստատված\n\n${callback.message.text}`
                            : `❌ Մերժված\n\n${callback.message.text}`,
                    reply_markup: { inline_keyboard: [] }, // ❌ կոճակները հանում ենք
                }),
            }
        );


        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("❌ TELEGRAM WEBHOOK ERROR:", err);
        return NextResponse.json({ ok: true });
    }
}
