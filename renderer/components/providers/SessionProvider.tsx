import supabase from "@/lib/utils/supabase";
import type { AuthError, PostgrestError, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

interface SessionContext {
    sessionLoading: boolean;
    session: Session | null;
    profileLoading: boolean;
    error: AuthError | PostgrestError | null;
}

const initialState: SessionContext = {
    sessionLoading: true,
    session: null,
    profileLoading: true,
    error: null,
};

const SessionProviderContext = createContext<SessionContext>(initialState);

export const SessionProvider = ({ children }: PropsWithChildren) => {
    const [sessionLoading, setSessionLoading] = useState<typeof initialState.sessionLoading>(initialState.sessionLoading);
    const [session, setSession] = useState<typeof initialState.session>(initialState.session);
    const [profileLoading, setProfileLoading] = useState<typeof initialState.profileLoading>(initialState.profileLoading);
    const [error, setError] = useState<typeof initialState.error>(initialState.error);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            setSessionLoading(false);
            if (!error) return setSession(session);
            setError(error);
            setProfileLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value: SessionContext = useMemo(() => ({ sessionLoading, session, profileLoading, error }), [sessionLoading, session, profileLoading, error]);

    return <SessionProviderContext.Provider value={value}>{children}</SessionProviderContext.Provider>;
};

export const useSession = () => {
    const context = useContext(SessionProviderContext);

    if (context === undefined) throw new Error("useSession must be used within a SessionProvider");

    return context;
};
