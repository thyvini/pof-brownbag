module Railway

let bind fn anterior =
  match anterior with
  | Ok valor -> fn valor
  | Error erro -> Error erro

let map fn anterior =
  match anterior with
  | Ok valor -> Ok (fn valor)
  | Error erro -> Error erro

let tee fn valor =
  fn valor
  valor

module Result =
  let tee teeing =
    Result.map (tee teeing)
