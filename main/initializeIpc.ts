import { ipcMain } from "electron";
import type { IConnect } from "../renderer/pages/home";
import connection from "./sequelize/connection";
import showDatabases from "./sequelize/showDatabases";

export default function initializeIpc() {
    ipcMain.on("connect", async (event, arg: IConnect) => {
        const conn = await connection(arg.connectionString);
        if (typeof conn === "boolean") {
            return event.reply("connect", conn);
        }
        return event.reply("connect", Boolean(conn));
    });
}
