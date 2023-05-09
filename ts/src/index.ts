import criarRepositorio from './repositorio'
import { inserirPaleta } from "./inserirPaleta"
import { criarDb, executarMigrations } from "./dbConfig"

const executar = async (args: string[]) => {
  const db = criarDb()

  await executarMigrations(db)

  if (args.length === 3 && args[0] === 'inserir') {
    const repositorio = criarRepositorio(db)
    inserirPaleta(repositorio, args[1], args[2])
  } else {
    console.log('Operação Inválida: use "inserir <nome-da-paleta> <nome-do-arquivo>" ou "ler"')
  }
}

const [_, __, ...args] = process.argv

executar(args)
