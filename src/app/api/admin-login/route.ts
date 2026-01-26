import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Սխալ տվյալներ" });
}
