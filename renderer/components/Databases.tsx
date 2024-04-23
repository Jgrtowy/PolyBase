import type { IConnect } from "@/types";
import React, { useContext, useEffect, useState } from "react";
import { useSession } from "./providers/SessionProvider";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import type { Tables } from "./utils/database.types";
import supabase from "./utils/supabase";

export default function Databases({ connect }: { connect: (connectionString: IConnect) => void }) {
    const { session } = useSession();
    const [databases, setDatabases] = useState<Tables<"connections">[] | null>(null);

    const fetchConnections = () =>
        session &&
        supabase
            .from("connections")
            .select("*")
            .eq("user_id", session.user.id)
            .then(({ data }) => data && setDatabases(data));

    useEffect(() => {
        fetchConnections();
    }, [session]);

    useEffect(() => {
        const todosChannel = supabase
            .channel("databases_updates")
            .on("postgres_changes", { event: "*", schema: "public", table: "connections" }, () => fetchConnections())
            .subscribe();

        return () => {
            supabase.removeChannel(todosChannel);
        };
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Databases</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    {databases?.map((database) => (
                        <Button key={database.id} variant="ghost" className={`flex gap-1 ${database.accent_color ?? ""}`} onClick={() => connect({ dialect: database.dialect, connectionString: database.connection_string })}>
                            {database.name ?? database.connection_string}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
