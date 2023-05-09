module Railway

let tee fn valor =
    fn valor
    valor

let toOptionError result =
    match result with
    | Error e -> Some e
    | _ -> None

module Result =
    let tee teeing = Result.map (tee teeing)

    let teeError teeing value =
        match value with
        | Error e ->
            teeing e
            value
        | _ -> value

    let toOptionError = toOptionError
