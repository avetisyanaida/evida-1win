import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const type = url.searchParams.get("type");

    const supabase = createRouteHandlerClient({ cookies });

    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }

    // ✅ եթե recovery է → reset
    if (type === "recovery") {
        return NextResponse.redirect("/reset" + url.search);
    }

    // ✅ մնացածը → home կամ profile
    return NextResponse.redirect("/");
}

