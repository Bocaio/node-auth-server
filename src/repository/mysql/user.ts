import { sql } from "kysely";
import database from "../../config/database.js";
import { User } from "../../types/index.js";

type UpdatableUserFields = Partial<Pick<User, "username" | "is_email_verified" | "password_hash">>;

export interface IUserRepository {
    create: (id: string, username: string, email: string, passwordHash: string) => Promise<void>;
    get: (email: string) => Promise<User | null>;
    getById: (id: string) => Promise<User | null>;
    update: (email: string, data: UpdatableUserFields) => Promise<number>;
    createGoogleUser: (id: string, username: string, email: string, googleId: string) => Promise<void>;
    getGoogleUser: (googleId: string) => Promise<User | null>;
}

export class UserRepository implements IUserRepository {
    create = async (id: string, username: string, email: string, passwordHash: string): Promise<void> => {
        await sql`INSERT INTO user (id, username, email, password_hash) VALUES (${id}, ${username}, ${email}, ${passwordHash})`.execute(database);
    };

    get = async (email: string): Promise<User | null> => {
        const user = await database
            .selectFrom("user")
            .where("email", "=", email)
            .selectAll()
            .executeTakeFirst();
        return user ?? null;
    };

    getById = async (id: string): Promise<User | null> => {
        const user = await database
            .selectFrom("user")
            .where("id", "=", id)
            .selectAll()
            .executeTakeFirst();
        return user ?? null;
    };

    update = async (email: string, data: UpdatableUserFields): Promise<number> => {
        const result = await database
            .updateTable("user")
            .set(data)
            .where("email", "=", email)
            .execute();
        return Number(result[0].numUpdatedRows);
    };

    createGoogleUser = async (id: string, username: string, email: string, googleId: string): Promise<void> => {
        await sql<User>`INSERT INTO user (id, username, email, google_id, auth_provider, is_email_verified) VALUES (${id}, ${username}, ${email}, ${googleId}, "google", true)`.execute(database);
    };

    getGoogleUser = async (googleId: string): Promise<User | null> => {
        const user = await database
            .selectFrom("user")
            .where("google_id", "=", googleId)
            .selectAll()
            .executeTakeFirst();
        return user ?? null;
    };
}
