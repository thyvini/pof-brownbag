module Result

open System

type Result<'TSuccess, 'TFailure> =
  | Success of 'TSuccess
  | Failure of 'TFailure

let goodResult = Success "foo"
let badResult  = Failure (Exception(""))
