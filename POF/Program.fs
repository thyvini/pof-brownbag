open Railway

let validaPodeIrNoRestaurante nome =
  match nome with
  | "João" -> Error "João tá de castigo"
  | x -> Ok 7

let validaNumeroDaSorte numero =
  if numero = 7 then Ok "João"
  else Error "Número zikado"

let repete str = str |> String.replicate 3

let imprime = printfn "%s"

let pipeline =
  validaPodeIrNoRestaurante
  >> Result.bind validaNumeroDaSorte
  >> Result.map repete
  >> Result.tee imprime

pipeline "Juca" |> printfn "%A"
