import { Kysely } from "kysely";
import { Database } from "./data";
import { Paleta } from "./paleta";

export type Repositorio = {
  inserirPaleta: (paleta: Paleta) => Promise<void>
}

export default (db: Kysely<Database>): Repositorio => ({
  inserirPaleta: async (paleta: Paleta): Promise<void> => {
    await db.transaction().execute(async (transaction) => {
      const { id } = await transaction.insertInto('paletas')
        .values({ nome: paleta.nome })
        .returning('id')
        .executeTakeFirstOrThrow()

      await transaction.insertInto('coresPaletas')
        .values(paleta.cores.map(cor => ({
          nome: cor.nome,
          cor: cor.cor,
          idPaleta: id
        })))
        .execute()
    })
  }
})