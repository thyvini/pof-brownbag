import { FileMigrationProvider, Kysely, Migrator, SqliteDialect } from "kysely";
import { Database } from "./data";
import Sqlite from 'better-sqlite3'
import path from "path";
import { promises as fs } from 'fs'

export const criarDb = () => new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new Sqlite('paleta.db')
  })
})

export const executarMigrations = async (db: Kysely<any>) => {
  const migrator = new Migrator({
    db: db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: __dirname + '/migrations'
    })
  })

  await migrator.migrateToLatest()
}