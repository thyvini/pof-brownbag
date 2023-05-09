export type Result<TSuccess, TFailure> =
  | Success<TSuccess>
  | Failure<TFailure>

export type Success<T> = {
  kind: 'success'
  success: T
  failure?: never
}

export type Failure<U> = {
  kind: 'failure'
  success?: never
  failure: U
}

export const success = <TSuccess>(value: TSuccess): Success<TSuccess> =>
  ({ kind: 'success', success: value })

export const failure = <TFailure>(value: TFailure): Failure<TFailure> =>
  ({ kind: 'failure', failure: value })

const isSuccess = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>): result is Success<TSuccess> =>
  result.kind === 'success'

const isFailure = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>): result is Failure<TFailure> =>
  result.kind === 'failure'

const bind = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => Result<TSuccess, TFailure>,
  anterior: Result<TParam, TFailure>
): Result<TSuccess, TFailure> =>
  isSuccess(anterior)
    ? fn(anterior.success)
    : anterior

const map = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => TSuccess,
  anterior: Result<TParam, TFailure>
): Result<TSuccess, TFailure> =>
  isSuccess(anterior)
    ? success(fn(anterior.success))
    : anterior

const tee = <TParam, TFailure>(
  fn: (param: TParam) => void,
  anterior: Result<TParam, TFailure>
): Result<TParam, TFailure> => {
  if (isSuccess(anterior)) {
    fn(anterior.success)
    return success(anterior.success)
  } else {
    return anterior
  }
}

const teeError = <TSuccess, TParam>(
  fn: (param: TParam) => void,
  anterior: Result<TSuccess, TParam>
): Result<TSuccess, TParam> => {
  if (isFailure(anterior)) {
    fn(anterior.failure)
    return failure(anterior.failure)
  } else {
    return anterior
  }
}

const elevate = <TSuccess, TFailure, TError>(
  errorConstructor: (param: TFailure[]) => TError,
  array: Result<TSuccess, TFailure>[]
): Result<TSuccess[], TError> => {
  if (array.findIndex(isFailure) !== -1) {
    return failure(
      errorConstructor(
        array
          .filter(isFailure)
          .map(result => result.failure)
      )
    )
  } else {
    return success(
      array
        .filter(isSuccess)
        .map(result => result.success)
    )
  }
}

export const result = {
  isSuccess,
  isFailure,
  bind,
  map,
  tee,
  teeError,
  elevate,
}
