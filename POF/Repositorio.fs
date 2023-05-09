module Repositorio

open System.Data
open Paleta
open Data
open Dapper.FSharp.SQLite

type Repositorio = {
    InserirPaleta: Paleta -> Async<unit>
}

let private inserirPaleta (conexaoDb: IDbConnection) (paleta: Paleta) =
    let paletaDb = { Nome = paleta.Nome }

    let coresPaletaDb id (cor: CorPaleta) =
        { Nome = cor.Nome
          Cor = $"#{cor.Cor.R:X2}{cor.Cor.G:X2}{cor.Cor.B:X2}"
          IdPaleta = id }

    task {
        let! id =
            insert {
                into paletaTable
                value paletaDb
            }
            |> conexaoDb.InsertAsync

        let cores = paleta.Cores |> Array.map (coresPaletaDb id) |> Array.toList

        insert {
            into corPaletaTable
            values cores
        }
        |> conexaoDb.InsertAsync
        |> ignore
    }
    |> Async.AwaitTask

let criarRepositorio conexaoDb = {
    InserirPaleta = inserirPaleta conexaoDb
}
