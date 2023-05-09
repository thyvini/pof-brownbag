module InserirPaleta

open System
open System.IO
open System.Drawing
open Railway
open Paleta
open Repositorio
open Erros
open DTOs
open StringExtensions

let lerArquivoDePaleta nomeDoArquivo =
    try
        Ok <| File.ReadAllLines nomeDoArquivo
    with excecao ->
        Error(ErroAoLerArquivo(nomeDoArquivo, excecao.Message))

let converterLinhaEmPaleta linhas =
    let dividirLinha (str: string) =
        str
        |> String.split " "
        |> Array.map String.trimWhiteSpaces
        |> Array.filter String.isNotNullOrWhiteSpace

    let dadosPaletas =
        linhas
        |> Array.map dividirLinha
        |> Array.mapi (fun (index: int) (linha: string array) ->
            match linha with
            | [| r; g; b; nome |] -> Ok { RGB = r, g, b; Nome = nome }
            | _ -> Error(index, linha |> String.concat " "))

    if Array.exists Result.isError dadosPaletas then
        dadosPaletas
        |> Array.filter Result.isError
        |> Array.choose Result.toOptionError
        |> (FormatoDePaletaInvalido >> Error)

    else
        dadosPaletas |> Array.choose Result.toOption |> Ok

let validarRGB dadosPaletas =
    let validacoes =
        dadosPaletas
        |> Array.mapi (fun (index: int) (dadosPaleta: InserirPaletaDto) ->
            let r, g, b = dadosPaleta.RGB

            match [| r; g; b |] with
            | x when Array.exists (String.canBeConvertedToInt32 >> not) x -> Error(index, $"{r}, {g}, {b}")
            | _ -> Ok())

    if Array.exists Result.isError validacoes then
        validacoes
        |> Array.filter Result.isError
        |> Array.choose Result.toOptionError
        |> (FormatoDePaletaInvalido >> Error)
    else
        Ok dadosPaletas

let converterRGBEmCores dadosPaletas =
    let cores =
        dadosPaletas
        |> Array.mapi (fun (index: int) (dadosPaleta: InserirPaletaDto) ->
            let rString, gString, bString = dadosPaleta.RGB

            let r = Int32.Parse(rString)
            let g = Int32.Parse(gString)
            let b = Int32.Parse(bString)

            let valorDeCorInvalido cor = cor > 255 || cor < 0

            match [| r; g; b |] with
            | x when Array.exists valorDeCorInvalido x -> Error(index, $"{r}, {g}, {b}")
            | _ ->
                Ok
                    { Nome = dadosPaleta.Nome
                      Cor = Color.FromArgb(r, g, b) })

    if Array.exists Result.isError cores then
        cores
        |> Array.filter Result.isError
        |> Array.choose Result.toOptionError
        |> (ValorDeCorInvalido >> Error)
    else
        cores |> Array.choose Result.toOption |> Ok

let criarPaleta nomeDaPaleta cores = { Nome = nomeDaPaleta; Cores = cores }

let salvarPaletaNoBancoDeDados (repositorio: Repositorio) paleta = repositorio.InserirPaleta paleta

let registrarErro (erro: ErroInsercaoPaleta) = Console.Error.WriteLine(erro)

let finalizar =
    function
    | Error(e: ErroInsercaoPaleta) -> printfn "Erro ao executar: %s" (e.MensagemDeErro())
    | Ok(paleta: Paleta) -> printfn "A paleta %s foi incluída com sucesso" paleta.Nome

[<RequireQualifiedAccess>]
module InserirPaleta =
    let executar repositorio nomePaleta =
        lerArquivoDePaleta
        >> Result.bind converterLinhaEmPaleta
        >> Result.bind validarRGB
        >> Result.bind converterRGBEmCores
        >> Result.map (criarPaleta nomePaleta)
        >> Result.tee (salvarPaletaNoBancoDeDados repositorio >> Async.RunSynchronously)
        >> Result.teeError (registrarErro)
        >> finalizar
