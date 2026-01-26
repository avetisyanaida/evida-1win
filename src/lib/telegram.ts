export async function sendWithdrawTelegram(
    withdrawId: string,
    userId: string,
    amount: number,
    method: string
) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID!;

    const text = `
💸 <b>Կանխիկացման հարցում</b>

👤 Օգտատեր: ${userId.slice(0, 6)}
💰 Գումար: ${amount.toLocaleString()} AMD
💳 Կանխիկացման եղանակ: ${method}
`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "✅ Հաստատել",
                            callback_data: `approve:${withdrawId}`,
                        },
                        {
                            text: "❌ Մերժել",
                            callback_data: `reject:${withdrawId}`,
                        },
                    ],
                ],
            },
        }),
    });
}
