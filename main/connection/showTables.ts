import { Sequelize } from "sequelize";

export async function showTables(params: string): Promise<string[]> {
    const sequelize = new Sequelize(params);
    const query = await sequelize.query("show tables;");
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const tables = query[0].map((table: any) => Object.values(table)[0]);
    return tables as string[];
}
