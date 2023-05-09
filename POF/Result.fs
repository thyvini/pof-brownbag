module Result

open System

type Result<'TSuccess, 'TFailure> =
  | Success of 'TSuccess
  | Failure of 'TFailure

let goodResult = Success "foo"
let badResult  = Failure (Exception(""))

let bind fn anterior =
  match anterior with
  | Ok valor -> fn valor
  | Error erro -> Error erro

let map fn anterior =
  match anterior with
  | Ok valor -> Ok (fn valor)
  | Error erro -> Error erro

