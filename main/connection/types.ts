export interface IUser {
    avatar_url: string;
    preferred_username: string | null;
    full_name: string;
}

export interface IConnect {
    connectionString: string;
    dialect: string;
}
