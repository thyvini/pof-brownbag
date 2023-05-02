import { success, failure, Result, makeRail } from "./railway"

const validaPodeIrNoRestaurante = (nome: string): Result<number, Error> => {
  return nome === 'João'
    ? failure(new Error('João tá de castigo'))
    : success(7)
}

const validaNumeroDaSorte = (numero: number): Result<string, Error> => {
  return numero === 7
    ? success('João')
    : failure(new Error('Numero zikado'))
}

const peteRepete = (str: string) => str.repeat(3)

const imprime = (str: string) => console.log(str, 'marche-melou')

makeRail(validaPodeIrNoRestaurante)
  .then(validaNumeroDaSorte)
  .map(peteRepete)
  .mapTee(imprime)
  .run('Juca')
