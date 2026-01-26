import { useTranslation } from "react-i18next";

interface VerifyDocumentProps {
    status: string | null;
}

export const VerifyDocument = ({ status }: VerifyDocumentProps) => {
    const { t } = useTranslation();

    return (
        <div className="verify-id verify">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="icon-file">
                    <i className="icon id"></i>
                    <p>{t("id_document_title")}</p>
                </div>

                {status === "approved" ? (
                    <p>✅ {t("doc_approved_text")}</p>
                ) : status === "pending" ? (
                    <p>⏳ {t("doc_pending_text")}</p>
                ) : status === "rejected" ? (
                    <p>❌ {t("doc_rejected_text")}</p>
                ) : (
                    <p style={{ color: "orange" }}>{t("doc_none_text")}</p>
                )}
            </div>

            <label>
                <input
                    type="text"
                    readOnly
                    value={
                        status === "approved"
                            ? t("doc_approved_input")
                            : status === "pending"
                                ? t("doc_pending_input")
                                : status === "rejected"
                                    ? t("doc_rejected_input")
                                    : t("doc_none_input")
                    }
                    className={`verify-input ${status ?? "empty"}`}
                />
            </label>
        </div>
    );
};
