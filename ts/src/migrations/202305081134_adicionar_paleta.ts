import { Kysely } from "kysely";

export async function up (db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('paletas')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('nome', 'varchar', col => col.notNull().unique())
    .execute()
  
  await db.schema
    .createTable('coresPaletas')
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('nome', 'varchar(255)', col => col.notNull())
    .addColumn('cor', 'varchar(7)', col => col.notNull())
    .addColumn('idPaleta', 'integer', col =>
      col.references('paletas.id').onDelete('cascade').notNull())
    .execute()
}

export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('coresPaletas').execute()
  await db.schema.dropTable('paletas').execute()
}
