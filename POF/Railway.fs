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

    let elevate (errorConstructor: 'TFailure array -> 'TError) (resultArray: Result<'TSuccess, 'TFailure> array) =
        if Array.exists Result.isError resultArray then
            resultArray
            |> Array.filter Result.isError
            |> Array.choose toOptionError
            |> (errorConstructor >> Error)
        else
            resultArray
            |> Array.choose Result.toOption
            |> Ok
