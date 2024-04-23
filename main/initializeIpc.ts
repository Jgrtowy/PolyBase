import { ipcMain } from "electron";
import { showData } from "./connection/showData";
import { showTables } from "./connection/showTables";
import { testConnection, testMongoConnection } from "./connection/testConnection";
import type { IConnect } from "./connection/types";

export default function initializeIpc() {
    ipcMain.on("connect", async (event, arg: IConnect) => {
        let conn: unknown;
        if (arg.dialect === "mongodb") {
            conn = await testMongoConnection(arg.connectionString);
        } else {
            conn = await testConnection(arg.connectionString);
        }
        return event.reply("connect", conn);
    });
    ipcMain.on("showTables", async (event, arg: IConnect) => {
        let conn: unknown;
        if (arg.dialect === "mongodb") {
            conn = await showTables(arg.connectionString);
        } else {
            conn = (await showTables(arg.connectionString)) as string[];
        }
        return event.reply("showTables", conn);
    });
    ipcMain.on("showData", async (event, arg: IConnect & { table: string }) => {
        const res = await showData(arg);
        return event.reply("showData", res);
    });
}
