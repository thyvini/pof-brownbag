import { Generated } from "kysely";

interface PaletaDb {
  id: Generated<number>
  nome: string
}

interface CorPaletaDb {
  id: Generated<number>
  nome: string
  cor: string
  idPaleta: number
}

export interface Database {
  paletas: PaletaDb
  coresPaletas: CorPaletaDb
}