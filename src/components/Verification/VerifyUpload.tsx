"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/src/hooks/supabaseClient";

interface DocumentUploadProps {
    userId: string | null;
    setStatus: (value: string | null) => void;
    uploadedFiles: Record<string, string | null>;
    setUploadedFiles: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

export const DocumentUpload = ({
                                   userId,
                                   setStatus,
                                   uploadedFiles,
                                   setUploadedFiles,
                               }: DocumentUploadProps) => {
    const { t } = useTranslation();

    const FILE_TYPES: Record<string, string> = {
        doc_front: t("doc_front"),
        doc_back: t("doc_back"),
        doc_selfie: t("doc_selfie"),
    };

    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [uploading, setUploading] = useState(false);
    const [openFiled, setOpenFiled] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");

    const getExistingStatus = async (type: string) => {
        const { data } = await supabase
            .from("verifications")
            .select("id, status, document_url")
            .eq("user_id", userId)
            .eq("document_type", type)
            .maybeSingle();

        return data;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedType) return;

        const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!allowed.includes(file.type)) {
            alert(t("invalid_file_type"));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert(t("file_too_large"));
            return;
        }

        setFiles((prev) => ({ ...prev, [selectedType]: file }));
    };

    const handleUpload = async () => {
        if (!userId) return alert(t("not_logged_in"));

        const allTypes = Object.keys(FILE_TYPES);
        setUploading(true);

        try {
            for (const type of allTypes) {
                const file = files[type];
                const old = await getExistingStatus(type);

                if (old && old.status !== "rejected") continue;

                if (old && old.status === "rejected") {
                    await supabase.from("verifications").delete().eq("id", old.id);
                    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
                }
                if (!file) continue;

                const filePath = `${userId}/${uuidv4()}_${file.name}`;

                const { error: uploadError } = await supabase.storage
                    .from("verification-docs")
                    .upload(filePath, file);

                if (uploadError) {
                    return uploadError;
                }

                const { error: insertError } = await supabase
                    .from("verifications")
                    .insert({
                        user_id: userId,
                        document_type: type,
                        document_url: filePath,
                        status: "pending",
                    });

                if (insertError) {
                    return insertError;
                }

                setUploadedFiles((prev) => ({ ...prev, [type]: filePath }));
            }

            alert(t("upload_success"));
            setStatus("pending");

        } catch (err: any) {
            alert(t("upload_error") + " " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div className="verify-upload">
                <div className="verify-file">
                    <div className="files-info" onClick={() => setOpenFiled(!openFiled)}>
                        <span>
                            {selectedType ? FILE_TYPES[selectedType] : t("select_doc_type")}
                        </span>
                        <i className={`icon ${openFiled ? "arrow-top" : "arrow-down"}`} />
                    </div>

                    <label className="file-label">
                        <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <span className="select-file-button">{t("choose_file")}</span>
                    </label>
                </div>

                {openFiled && (
                    <ul>
                        {Object.entries(FILE_TYPES).map(([key, label]) => (
                            <li key={key} onClick={() => setSelectedType(key)}>
                                {label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="uploading-files">
                {Object.entries(FILE_TYPES).map(([key, label]) => (
                    <div key={key} className="file-preview">
                        <p>
                            <strong>{label}</strong>{" "}
                            {uploadedFiles[key] ? (
                                <span style={{ color: "#4fa3ff" }}>{t("uploaded")}</span>
                            ) : files[key] ? (
                                <>{files[key]!.name}</>
                            ) : (
                                <span style={{ color: "#888" }}>{t("not_uploaded")}</span>
                            )}
                        </p>
                    </div>
                ))}

                <button
                    className="upload-btn"
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ marginTop: "15px" }}
                >
                    {uploading ? t("uploading") : t("submit_for_review")}
                </button>
            </div>
        </>
    );
};
