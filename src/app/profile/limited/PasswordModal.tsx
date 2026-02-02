"use client";

interface PasswordModalProps {
    password: string;
    setPassword: (v: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
    t: (key: string) => string;
}

export default function PasswordModal({
                                          password,
                                          setPassword,
                                          onCancel,
                                          onConfirm,
                                          t,
                                      }: PasswordModalProps) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{t("limit_enter_password")}</h3>

                <input
                    type="password"
                    className="modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("limit_password_placeholder")}
                    autoFocus
                />

                <div
                    style={{
                        marginTop: 15,
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                    }}
                >
                    <button className="overlay-btn confirm-btn" onClick={onConfirm}>
                        {t("limit_confirm")}
                    </button>

                    <button
                        className="overlay-btn cancel-btn"
                        style={{ background: "grey" }}
                        onClick={onCancel}
                    >
                        {t("limit_cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}
