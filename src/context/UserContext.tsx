"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface UserData {
    id: string;
    email: string;
    name: string;
    uniqueId: string;
}

interface UserContextType {
    user: UserData | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        setLoading(true);

        const { data } = await supabase.auth.getSession();
        const authUser = data.session?.user;

        if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from("users")
            .select("first_name, unique_id")
            .eq("user_id", authUser.id)
            .single();

        setUser({
            id: authUser.id,
            email: authUser.email ?? "",
            name: profile?.first_name ?? "",
            uniqueId: profile?.unique_id ?? "",
        });

        setLoading(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            await loadUser();
        }
        fetchUser().then(r => r)

        const { data: listener } = supabase.auth.onAuthStateChange(() => {
            loadUser().then(r => r);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
