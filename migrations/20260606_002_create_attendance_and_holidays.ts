import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Table: holidays
  await knex.schema.createTable("holidays", (table) => {
    table.bigIncrements("id").primary();
    table.date("holiday_date").notNullable().unique();
    table.string("description", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });

  // Table: attendances
  await knex.schema.createTable("attendances", (table) => {
    table.bigIncrements("id").primary();
    table
      .bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.date("date").notNullable();
    table.time("check_in").nullable();
    table.time("check_out").nullable();
    table.text("check_in_photo").nullable();
    table.text("check_out_photo").nullable();
    table.text("check_in_notes").nullable();
    table.text("check_out_notes").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    // A user can only have one attendance record per day
    table.unique(["user_id", "date"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("attendances");
  await knex.schema.dropTableIfExists("holidays");
}
