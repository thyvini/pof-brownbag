module Data

open Dapper.FSharp.SQLite

type PaletaDb = { Nome: string }

and CorPaletaDb =
    { Nome: string
      Cor: string
      IdPaleta: int }

let paletaTable = table'<PaletaDb> "Paletas"
let corPaletaTable = table'<CorPaletaDb> "CoresPaletas"
