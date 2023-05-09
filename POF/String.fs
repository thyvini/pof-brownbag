module StringExtensions

open System

[<RequireQualifiedAccess>]
module String =
    let trimWhiteSpaces (str: string) = str.Trim()

    let canBeConvertedToInt32 (str: string) = Int32.TryParse str |> fst

    let isNotNullOrWhiteSpace (str: string) = String.IsNullOrWhiteSpace str |> not

    let split (separator: string) (str: string) = str.Split(separator)
