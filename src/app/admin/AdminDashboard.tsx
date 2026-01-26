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
        <div className={'dashboard-wrap'} style={dashboardWrap}>
            <h1 style={title}>🛠 Admin Dashboard</h1>

            <div style={section}>
                <h2 style={sectionTitle}>📁 Վերիֆիկացիայի փաստաթղթերը</h2>
                <VerificationAdmin data={rows} />
            </div>

            <div style={section}>
                <h2 style={sectionTitle}>💬 Ադմին Չատ</h2>
                <ChatAdmin />
            </div>

            <div style={section}>
                <h2 style={sectionTitle}>
                    💸 Withdraw Requests
                </h2>
                <WithdrawAdmin/>
            </div>
        </div>
    );
}

const dashboardWrap: React.CSSProperties = {
    padding: "25px",
    background: "#0d0d0d",
    minHeight: "100vh",
    color: "white",
    fontFamily: "sans-serif",
};

const title: React.CSSProperties = {
    fontSize: "28px",
    marginBottom: "25px",
    fontWeight: "bold",
};

const section: React.CSSProperties = {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "35px",
    border: "1px solid #222",
};

const sectionTitle: React.CSSProperties = {
    marginBottom: "15px",
    fontSize: "20px",
    borderBottom: "1px solid #333",
    paddingBottom: "8px",
};
