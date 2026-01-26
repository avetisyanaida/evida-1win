import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";

export async function POST(req: Request) {
    const { id, status, comment } = await req.json();

    const { error } = await supabaseAdmin
        .from("verifications")
        .update({
            status,
            admin_comment: comment ?? ""
        })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true });
}
