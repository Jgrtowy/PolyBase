import { Sequelize } from "sequelize";
import type { IConnect } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function showData(params: IConnect & { table: string }): Promise<any> {
    try {
        const sequelize = new Sequelize(params.connectionString);
        const query = await sequelize.query(`select * from ${params.table};`);
        const keys = query[0][0] ? Object.keys(query[0][0]) : [];
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const values = query[0].map((data: any) => Object.values(data));
        return { keys, values };
    } catch (error) {
        console.log(error);
    }
}
