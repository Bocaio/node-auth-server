import pool from "../database/index.js";
import { RowDataPacket } from "mysql2";

interface UserRepositoryType {
    create: (username: string, email: string, passwordHash: string) => Promise<any>
    get: (email: string) => Promise<any>
    createGoogleUser: (username: string, email: string, googleId: string) => Promise<any>;
    getGoogleUser: (googleId: string) => Promise<any>;
}

class UserRepository {
    create = async (username: string, email: string, passwordHash: string) => {
        const query = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
        const [rows] = await pool.execute(query, [username, email, passwordHash]);
        return rows;
    }
    get = async (email: string) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute<RowDataPacket[]>(query, [email]);
        const user = rows[0];
        return user ?? null;
    }
    createGoogleUser = async (username: string, email: string, googleId: string) => {
        const query = `INSERT INTO users (name, email, google_id ,auth_provider) VALUES (?, ?, ?,"google")`;
        const [rows] = await pool.execute(query, [username, email, googleId]);
        return rows;
    }
    getGoogleUser = async (googleId: string) => {
        const query = `SELECT * FROM users WHERE google_id = ?`;
        const [rows] = await pool.execute<RowDataPacket[]>(query, [googleId]);
        const user = rows[0];
        return user ?? null
    }
}

export { UserRepository, UserRepositoryType }