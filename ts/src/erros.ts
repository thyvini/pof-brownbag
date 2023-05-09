export type ErroInsercaoPaleta =
  | { kind: 'erro_ao_ler_arquivo', nomeDoArquivo: string, mensagemDeErro: string }
  | { kind: 'formato_de_paleta_invalido', linhas: [number, string][] }
  | { kind: 'valor_de_cor_invalido', linhas: [number, string][] }
  | { kind: 'erro_ao_salvar_paleta_no_banco_de_dados', mensagemDeErro: string }

export const mensagemErroInsercaoPaleta = (erro: ErroInsercaoPaleta) => {
  switch (erro.kind) {
    case 'erro_ao_ler_arquivo':
      return `Erro ao ler arquivo ${erro.nomeDoArquivo}: ${erro.mensagemDeErro}`

    case 'formato_de_paleta_invalido':
      const linhasPaletaInvalidas = erro.linhas.map(([linha, valor]) => `\t${linha + 1}: ${valor}`).join('\n')
      return `Formato de paleta inválido:\n${linhasPaletaInvalidas}`

    case 'valor_de_cor_invalido':
      const coresInvalidas = erro.linhas.map(([linha, valor]) => `\t${linha + 1}: ${valor}`).join('\n')
      return `Valor de cor inválido, insira valores entre 0 e 255:\n${coresInvalidas}`

    case 'erro_ao_salvar_paleta_no_banco_de_dados':
      return `Erro ao salvar paleta no banco de dados: ${erro.mensagemDeErro}\n
      Se persistir o erro, contate o administrador do sistema.`
  }
}