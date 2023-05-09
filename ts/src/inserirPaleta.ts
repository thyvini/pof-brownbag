import fs from 'fs'
import { Failure, Result, Success, failure, result, success } from './result'
import { makeRail } from './railway'
import { ErroInsercaoPaleta, mensagemErroInsercaoPaleta } from './erros'
import { InserirPaletaDto } from './dtos'
import { CorPaleta, Paleta } from './paleta'
import { Repositorio } from './repositorio'

const lerArquivoDePaleta = (nomeDoArquivo: string): Result<string, ErroInsercaoPaleta> => {
  try {
    return success(fs.readFileSync(nomeDoArquivo).toString())
  } catch (error) {
    return failure({
      kind: 'erro_ao_ler_arquivo',
      nomeDoArquivo,
      mensagemDeErro: (error as Error).message
    })
  }
}

const separarArquivoEmLinhas = (arquivo: string): string[] =>
  arquivo.split('\n')

const converterLinhasEmPaleta = (linhas: string[]): Result<InserirPaletaDto[], ErroInsercaoPaleta> => {
  const dadosPaleta =
    linhas
      .map(linha => linha
        .split(' ')
        .map(l => l.trim())
        .filter(l => l !== ''))
      .map((linha, indice): Result<InserirPaletaDto, [number, string]> => {
        if (linha.length !== 4) return failure([indice, linha.join(' ')])

        let [r, g, b, nome] = linha

        return success({ rgb: [r, g, b], nome })
      })

  return result.elevate((linhas) => ({ kind: 'formato_de_paleta_invalido', linhas }), dadosPaleta)
}

const converterRgbEmCores = (dadosPaleta: InserirPaletaDto[]): Result<CorPaleta[], ErroInsercaoPaleta> => {
  const cores =
    dadosPaleta.map((dadosCor, indice): Result<CorPaleta, [number, string]> => {
      const [rString, gString, bString] = dadosCor.rgb

      const r = Number(rString)
      const g = Number(gString)
      const b = Number(bString)

      const valorDeCorInvalido = (cor: number) => isNaN(cor) || cor > 255 || cor < 0

      if ([r, g, b].findIndex(valorDeCorInvalido) !== -1) {
        return failure([indice, dadosCor.rgb.join(', ')])
      }

      const toHex = (number: number) => number.toString(16).padStart(2, '0')
      const cor = `#${toHex(r)}${toHex(g)}${toHex(b)}`

      return success({ nome: dadosCor.nome, cor })
    })

  return result.elevate((linhas) => ({ kind: 'valor_de_cor_invalido', linhas }), cores)
}

const criarPaleta = (nome: string, cores: CorPaleta[]): Paleta => ({
  nome,
  cores
})

const salvarPaletaNoBancoDeDados = (repositorio: Repositorio, paleta: Paleta): void => {
  repositorio.inserirPaleta(paleta)
    .catch((e: Error) => {
      throw new Error(e.message)
    })
}

const imprimirResultado = (resultado: Result<Paleta, ErroInsercaoPaleta>) => {
  if (result.isSuccess(resultado)) {
    const paleta = (resultado as Success<Paleta>).success
    console.log(`Paleta ${paleta.nome} inserida com sucesso.\n`)
  } else {
    const erro = (resultado as Failure<ErroInsercaoPaleta>).failure
    console.log(mensagemErroInsercaoPaleta(erro))
  }
}

const gravarErro = (erro: ErroInsercaoPaleta) => {
  console.error(erro)
}

export const inserirPaleta = (repositorio: Repositorio, nomeDaPaleta: string, nomeDoArquivo: string) => {
  makeRail(lerArquivoDePaleta)
    .map(separarArquivoEmLinhas)
    .then(converterLinhasEmPaleta)
    .then(converterRgbEmCores)
    .map((cores) => criarPaleta(nomeDaPaleta, cores))
    .tee((paleta) => salvarPaletaNoBancoDeDados(repositorio, paleta))
    .teeError(gravarErro)
    .finally(imprimirResultado)
    .run(nomeDoArquivo)
}
