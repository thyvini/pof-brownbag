open System
open DbConfig
open InserirPaleta
open Repositorio
open System.Data.SQLite

let args = Environment.GetCommandLineArgs()

let executar args = 
    efetuarMigrations()

    use conexaoDb = new SQLiteConnection("Data Source=paleta.db")
    let repositorio = criarRepositorio conexaoDb

    match args with
    | [| _; "inserir"; nomeDaPaleta; nomeDoArquivo |] ->
        InserirPaleta.executar repositorio nomeDaPaleta nomeDoArquivo
    | _ -> invalidArg "operacao" "Operação Inválida: use 'inserir <nome-da-paleta> <nome-do-arquivo>' ou 'ler'"

executar args
