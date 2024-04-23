import { connect } from "mongoose";
import { Sequelize } from "sequelize";

export async function testConnection(params: string): Promise<boolean> {
    try {
        const conn = new Sequelize(params);
        await conn.authenticate();
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return false;
    }
}

export async function testMongoConnection(params: string): Promise<boolean> {
    try {
        await connect(params);
        return true;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        return false;
    }
}
