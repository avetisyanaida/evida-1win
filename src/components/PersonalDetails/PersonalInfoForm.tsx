import React from "react";
import { useTranslation } from "react-i18next";

interface FormsPersonal {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    day: string;
    month: string;
    year: string;
    gender: string;
    country: string;
    personalNumber: string;
}

interface PersonalInfoFormProps {
    formsPersonal: FormsPersonal;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    phone: string;
    setPhone: (phone: string) => void;
    usernameStatus: "idle" | "checking" | "taken" | "free";
}


export const PersonalInfoForm = ({
                                     formsPersonal,
                                     handleChange,
                                     phone,
                                     setPhone,
                                     usernameStatus,
                                 }: PersonalInfoFormProps) => {
    const { t } = useTranslation();

    return (
        <div className="personal-details-info fade">
            <div className="details-info-item">
                <label>
                    <input
                        onChange={handleChange}
                        name="userName"
                        value={formsPersonal.userName}
                        type="text"
                        placeholder={t("username")}
                        className={usernameStatus === "taken" ? "input-error" : ""}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="email"
                        value={formsPersonal.email}
                        type="email"
                        placeholder={t("email")}
                    />
                </label>

                <label>
                    <input
                        type="tel"
                        value={phone}
                        placeholder={t("phone")}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="firstName"
                        value={formsPersonal.firstName}
                        type="text"
                        placeholder={t("firstName")}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="lastName"
                        value={formsPersonal.lastName}
                        type="text"
                        placeholder={t("lastName")}
                    />
                </label>
            </div>

            <div className="details-info-item">
                <label>
                    <select name="gender" value={formsPersonal.gender} onChange={handleChange}>
                        <option value="female">{t("female")}</option>
                        <option value="male">{t("male")}</option>
                    </select>
                </label>

                <div className="birth-day">
                    <input
                        onChange={handleChange}
                        name="day"
                        value={formsPersonal.day}
                        type="number"
                        placeholder={t("day")}
                    />
                    <select name="month" value={formsPersonal.month} onChange={handleChange}>
                        <option value="january">{t("january")}</option>
                        <option value="february">{t("february")}</option>
                        <option value="march">{t("march")}</option>
                        <option value="april">{t("april")}</option>
                        <option value="may">{t("may")}</option>
                        <option value="june">{t("june")}</option>
                        <option value="july">{t("july")}</option>
                        <option value="august">{t("august")}</option>
                        <option value="september">{t("september")}</option>
                        <option value="october">{t("october")}</option>
                        <option value="november">{t("november")}</option>
                        <option value="december">{t("december")}</option>
                    </select>
                    <input
                        onChange={handleChange}
                        name="year"
                        value={formsPersonal.year}
                        type="number"
                        placeholder={t("year")}
                    />
                </div>

                <label>
                    <select name="country" value={formsPersonal.country} onChange={handleChange}>
                        <option value="Armenia">{t("armenia")}</option>
                        <option value="Georgia">{t("georgia")}</option>
                    </select>
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="personalNumber"
                        value={formsPersonal.personalNumber}
                        type="text"
                        placeholder={t("personalNumber")}
                    />
                </label>
            </div>
        </div>
    );
};
