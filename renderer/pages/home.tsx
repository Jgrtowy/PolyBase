import AddDatabase from "@/components/AddDatabase";
import DBExplorer from "@/components/DBExplorer";
import Databases from "@/components/Databases";
import { toast } from "@/components/ui/UseToast";
import sendIpcSignal from "@/components/utils/sendIpcSignal";
import supabase from "@/components/utils/supabase";
import type { IConnect, IUser } from "@/types";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState<IUser>();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then((user) => {
            if (!user.data.session) {
                router.push("/login");
            }
            setSession(user.data.session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [session]);

    useEffect(() => {
        supabase.auth.getUser().then((user) => {
            if (user.data.user) setUser(user.data.user.user_metadata as IUser);
        });
    }, []);

    const connect = async (data: IConnect) => {
        setData(null);
        await sendIpcSignal("connect", data).then((res: boolean) => {
            if (res) setData(data);
            toast({
                title: res ? "Connected" : "Failed",
            });
        });
    };

    const [data, setData] = useState<IConnect | null>(null);

    return (
        <>
            {user && (
                <div className="p-2 flex gap-2 max-w-screen">
                    <div className="flex flex-col gap-2 w-1/6">
                        <Databases connect={connect} />
                        <div>
                            <AddDatabase />
                        </div>
                    </div>
                    <div className="w-5/6 flex gap-2">{data && <DBExplorer conn={data} />}</div>
                </div>
            )}
        </>
    );
}
