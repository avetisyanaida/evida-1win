import { supabaseAdmin } from "@/src/hooks/supabaseAdmin";
import AdminDashboard from "@/src/app/admin/AdminDashboard";

export default async function AdminPage() {

    const { data: verifs } = await supabaseAdmin
        .from("verifications")
        .select("*")
        .order("created_at", { ascending: false });

    const { data: users } = await supabaseAdmin
        .from("users")
        .select("user_id, first_name, last_name");

    return (
        <AdminDashboard
            verifs={verifs ?? []}
            users={users ?? []}
        />
    );
}
