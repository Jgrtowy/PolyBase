import type { IConnect } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Data from "./Data";
import Tables from "./Tables";
import sendIpcSignal from "./utils/sendIpcSignal";

export default function DBExplorer({ conn }: { conn: IConnect }) {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [data, setData] = useState<{ keys: unknown[]; values: unknown[] } | null>(null);
    const [columns, setColumns] = useState<ColumnDef<unknown, unknown>[]>([]);
    const [formattedData, setFormattedData] = useState<unknown[][]>([]);
    useEffect(() => {
        sendIpcSignal("showTables", conn).then((res) => {
            setTables(res as string[]);
        });
    }, [conn]);

    useEffect(() => {
        if (selectedTable) {
            sendIpcSignal("showData", { ...conn, table: selectedTable }).then((res) => {
                setData(res as { keys: unknown[]; values: unknown[] });
            });
        }
    }, [selectedTable]);

    useEffect(() => {
        if (!data) return;
        setColumns(
            data?.keys.map((column) => ({
                id: column,
                header: column,
                accessorKey: column,
            })) as ColumnDef<unknown, unknown>[],
        );

        setFormattedData(
            data.values.map((values) => {
                const obj = {};
                data.keys.forEach((key, index) => {
                    // @ts-ignore
                    obj[String(key)] = values[index];
                });
                return obj;
            }) as unknown[][],
        );
    }, [data]);

    return (
        <>
            <div className="w-1/5">
                <Tables tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable} />
            </div>
            <div className="w-4/5 max-h-screen">{data && columns && <Data columns={columns} data={formattedData} />}</div>
        </>
    );
}
