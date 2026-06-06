import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("google_id", 255).unique().nullable();
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.text("avatar_url").nullable();
    table
      .enum("role", ["admin", "employee"])
      .notNullable()
      .defaultTo("employee");
    table
      .enum("status", ["unverified", "verified"])
      .notNullable()
      .defaultTo("unverified");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
