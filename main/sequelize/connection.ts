import { Sequelize, type Options } from "sequelize";
import type { IConnect } from "../../renderer/pages/home";

export default async (params: string): Promise<Sequelize | boolean> => {
    try {
        const conn = new Sequelize(params);
        await conn.authenticate();
        return conn;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return false;
    }
};
