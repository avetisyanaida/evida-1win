import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const {user_id, card_id} = await req.json();

    if (!user_id || !card_id) {
        return NextResponse.json(
            {error: "Invalid payload"},
            {status: 400}
        );
    }

    const {data: card} = await supabase
        .from("cards")
        .select("id")
        .eq("id", card_id)
        .eq("user_id", user_id)
        .maybeSingle();

    if (!card) {
        return NextResponse.json(
            {error: "Card not found"},
            {status: 403}
        );
    }

    const {error} = await supabase
        .from("cards")
        .delete()
        .eq("id", card_id);

    if (error) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        );
    }
    return NextResponse.json({success: true});
}