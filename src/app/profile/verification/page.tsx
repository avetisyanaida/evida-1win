"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";

import { VerifyEmail } from "@/src/components/Verification/VerifyEmail";
import { VerifyPhone } from "@/src/components/Verification/VerifyPhone";
import { VerifyDocument } from "@/src/components/Verification/VerifyDocument";
import Profile from "@/src/app/profile/page";
import { DocumentUpload } from "@/src/components/Verification/VerifyUpload";

import type { VerificationUser } from "@/src/types/verification";

interface VerificationRow {
    document_type: string;
    document_url: string;
    status: string;
}

export default function Verification() {
    const { t } = useTranslation();

    const [user, setUser] = useState<VerificationUser | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, string | null>>({});

    // 🔥 LOAD USER + VERIFICATIONS
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data?.user) return;

            const u = data.user;

            setUser({
                id: u.id,
                email: u.email ?? null,
                phone: u.phone ?? null,
                verifiedEmail: Boolean(u.email_confirmed_at),
            });

            // Load verification rows
            const { data: verRows } = await supabase
                .from("verifications")
                .select("document_type, document_url, status")
                .eq("user_id", u.id);

            if (verRows?.length) {
                const urls: Record<string, string> = {};

                verRows.forEach((v: VerificationRow) => {
                    if (v.status !== "rejected") {
                        urls[v.document_type] = v.document_url;
                    }
                });

                setUploadedFiles(urls);

                // If ANY doc is pending → status = pending
                if (verRows.some((v) => v.status === "pending")) {
                    setStatus("pending");
                } else if (verRows.every((v) => v.status === "approved")) {
                    setStatus("approved");
                } else if (verRows.some((v) => v.status === "rejected")) {
                    setStatus("rejected");
                }
            }
        };

        fetchData().then(r => r);
    }, []);

    const renderStatus = () => {
        switch (status) {
            case "pending":
                return <p style={{ color: "orange" }}>{t("status_pending")}</p>;
            case "approved":
                return <p style={{ color: "green" }}>{t("status_approved")}</p>;
            case "rejected":
                return <p style={{ color: "red" }}>{t("status_rejected")}</p>;
            default:
                return <p>{t("status_none")}</p>;
        }
    };

    return (
        <>
            <Profile />

            <section>
                <div className="container">
                    <div className="verification-content">

                        {/* STATUS BANNER */}
                        {renderStatus()}

                        <div className="verification-info">
                            <VerifyEmail user={user} />
                            <VerifyPhone user={user} />
                            <VerifyDocument status={status} />
                        </div>

                        {/* DOCUMENT UPLOAD SECTION */}
                        {user && (
                            <DocumentUpload
                                userId={user.id}
                                setStatus={setStatus}
                                uploadedFiles={uploadedFiles}
                                setUploadedFiles={setUploadedFiles}
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
