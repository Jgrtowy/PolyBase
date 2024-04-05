import { Sequelize } from "sequelize";
import { IDatabaseSchema } from "./types";

export default async (params: Sequelize): Promise<IDatabaseSchema[]> => {
	const query = await params.query("show databases;");

	return query as IDatabaseSchema[];
};
