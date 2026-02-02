import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { amount, method } = await req.json();

    return NextResponse.json({
        redirectUrl: `/test-card?amount=${amount}&method=${method}`,
    });
}
