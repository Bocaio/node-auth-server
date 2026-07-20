import { Generated, Selectable } from "kysely";

export interface Database {
    user: UserTable;
}

export interface UserTable {
    id: string;
    username: string;
    email: string;
    password_hash: string | null;
    google_id: string | null;
    created_at: Generated<Date>;
    is_email_verified: boolean;
    auth_provider: string | null;
}

export type User = Selectable<UserTable>;
