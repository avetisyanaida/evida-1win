import React, { useState, useEffect } from "react";
import {supabase} from "@/src/hooks/supabaseClient";

export const usePersonalDetails = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [formsPersonal, setFormsPersonal] = useState({
        userName: "",
        email: "",
        phoneCode: "+374",
        firstName: "",
        lastName: "",
        gender: "Իգական",
        day: "19",
        month: "january",
        year: "",
        country: "Armenia",
        personalNumber: "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (error) {
                console.error("❌ Error loading:", error);
                return;
            }

            if (data) {
                setFormsPersonal((prev) => ({
                    ...prev,
                    userName: data.user_name || "",
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    email: data.email || "",
                    phoneCode: data.phone_code || "+374",
                    gender: data.gender || "Իգական",
                    day: data.birth_day?.toString() || "19",
                    month: data.birth_month || "january",
                    year: data.birth_year?.toString() || "",
                    country: data.country || "Armenia",
                    personalNumber: data.personal_number || "",
                }));
                setPhone(data.phone_code || "");
            }
        };

        fetchUser().then(r => r);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormsPersonal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return { formsPersonal, setFormsPersonal, handleChange, phone, setPhone, userId, loading, setLoading };
};
