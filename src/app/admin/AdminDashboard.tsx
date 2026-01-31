"use client";
import React from "react";
import VerificationAdmin from "@/src/app/admin/VerificationAdmin";
import ChatAdmin from "@/src/app/admin/ChatAdmin";
import WithdrawAdmin from "@/src/app/admin/WithdrawAdmin";

interface VerificationRow {
    id: number;
    user_id: string;
    document_url: string;
    document_type: string;
    status: string;
    admin_comment?: string;
    created_at: string;
}

interface UserRow {
    user_id: string;
    first_name?: string;
    last_name?: string;
}

interface AdminDashboardProps {
    verifs: VerificationRow[];
    users: UserRow[];
}

export default function AdminDashboard({ verifs, users }: AdminDashboardProps) {
    const rows = verifs.map((v: VerificationRow) => {
        const u = users.find((x: UserRow) => x.user_id === v.user_id);
        return {
            ...v,
            first_name: u?.first_name ?? "",
            last_name: u?.last_name ?? "",
        };
    });

    return (
        <div className={'dashboard-wrap'}>
            <h1  className={'dashboard-title'}>🛠 Admin Dashboard</h1>

            <div className={'dashboard-body'}>
                <h2 className={'dashboard-body-title'}>📁 Վերիֆիկացիայի փաստաթղթերը</h2>
                <VerificationAdmin data={rows} />
            </div>

            <div className={'dashboard-body'}>
                <h2 className={'dashboard-body-title'}>💬 Ադմին Չատ</h2>
                <ChatAdmin />
            </div>

            <div className={'dashboard-body'}>
                <h2 className={'dashboard-body-title'}>
                    💸 Withdraw Requests
                </h2>
                <WithdrawAdmin/>
            </div>
        </div>
    );
}
