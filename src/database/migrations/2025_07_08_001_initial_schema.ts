import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "char(36)", (col) => col.primaryKey())
    .addColumn("username", "varchar(30)", (col) => col.notNull().unique())
    .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("password_hash", "varchar(255)")
    .addColumn("google_id", "varchar(255)", (col) => col.unique())
    .addColumn("created_at", "datetime", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn("is_email_verified", "boolean", (col) => col.defaultTo(false))
    .addColumn("auth_provider", "varchar(20)")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").ifExists().execute();
}
