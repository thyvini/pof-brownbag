module Erros

type ErroInsercaoPaleta =
    | ErroAoLerArquivo of nomeDoArquivo: string * mensagemDeErro: string
    | FormatoDePaletaInvalido of linhas: (int * string) array
    | ValorDeCorInvalido of linhas: (int * string) array
    | ErroAoSalvarPaletaNoBancoDeDados of mensagem: string

    member this.MensagemDeErro() =
        match this with
        | ErroAoLerArquivo(nomeDoArquivo, mensagemDeErro) -> $"Erro ao ler arquivo '{nomeDoArquivo}': {mensagemDeErro}"
        | FormatoDePaletaInvalido(linhas) ->
            let linhasErradas =
                linhas
                |> Array.map (fun (numero, texto) -> $"\tLinha {numero + 1}: {texto}")
                |> String.concat "\n"

            $"Formato de paleta inválido:\n{linhasErradas}"
        | ValorDeCorInvalido(linhas) ->
            let linhasErradas =
                linhas
                |> Array.map (fun (numero, texto) -> $"\tLinha {numero + 1}: {texto}")
                |> String.concat "\n"

            $"Valor de cor inválido (insira valores entre 0 e 255):\n{linhasErradas}"
        | ErroAoSalvarPaletaNoBancoDeDados(mensagem) ->
            $"Erro ao persistir paleta no banco de dados: {mensagem}\n\nSe persistir o erro, contate o administrador do sistema"
