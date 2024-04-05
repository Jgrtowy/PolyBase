import AddDatabase from "@/components/AddDatabase";
import Databases from "@/components/Databases";
import Header from "@/components/Header";
import { toast } from "@/components/ui/UseToast";
import supabase from "@/components/utils/supabase";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface IUser {
    avatar_url: string;
    preferred_username: string | null;
    full_name: string;
}

export interface IConnect {
    connectionString: string;
    dialect: string;
}

export default function HomePage() {
    // const [connection, setConnection] = useState<boolean>(false);
    // const [result, setResult] = useState<IDatabaseSchema[]>([]);

    // useEffect(() => {
    // 	window.ipc.on("connect", (event, arg) => {
    // 		setConnection(JSON.parse(event as string));
    // 	});

    // 	window.ipc.on("dbs", (event, arg) => {
    // 		setResult(event as IDatabaseSchema[]);
    // 	});

    // 	return () => {
    // 		window.ipc.removeAllListeners("connect");
    // 		window.ipc.removeAllListeners("dbs");
    // 	};
    // }, []);

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
        await sendIpcSignal("connect", data).then((res: IConnect | boolean) => {
            toast({
                title: res ? "Connected" : "Failed",
            });
        });
    };

    // biome-ignore lint/suspicious/noExplicitAny:
    const sendIpcSignal = (channel: string, data: any) => {
        // biome-ignore lint/suspicious/noExplicitAny:
        return new Promise<any>((resolve, reject) => {
            window.ipc.send(channel, data);
            window.ipc.on(channel, (event, arg) => {
                if (typeof event === "boolean") {
                    resolve(event);
                }
                reject(arg);
            });
            return () => {
                window.ipc.removeAllListeners(channel);
            };
        });
    };

    return (
        <>
            {user && (
                <div>
                    <Header user={user} />
                    <div className="m-3 flex gap-2">
                        <div className="flex flex-col gap-2 w-1/5">
                            <Databases connect={connect} />
                            <div>
                                <AddDatabase />
                            </div>
                        </div>
                        <div>{}</div>
                    </div>
                </div>
            )}
        </>
    );
}
