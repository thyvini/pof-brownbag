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

export const success = <TSuccess, TFailure>(value: TSuccess): Result<TSuccess, TFailure> => ({ kind: 'success', success: value })
export const failure = <TSuccess, TFailure>(value: TFailure): Result<TSuccess, TFailure> => ({ kind: 'failure', failure: value })

const bind = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => Result<TSuccess, TFailure>,
  anterior: Result<TParam, TFailure>
): Result<TSuccess, TFailure> => {
  switch (anterior.kind) {
    case 'success':
      return fn(anterior.success)
    case 'failure':
      return anterior
  }
}

const map = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => TSuccess,
  anterior: Result<TParam, TFailure>
) => {
  switch (anterior.kind) {
    case 'success':
      return success(fn(anterior.success))
    case 'failure':
      return anterior
  }
}

const tee = <TParam>(
  fn: (param: TParam) => void,
  param: TParam
) => {
  fn(param)
  return param
}

export const makeRail = <TParam, TSuccess, TError>(
  fn: (param: TParam) => Result<TSuccess, TError>
) => ({
  then: <USuccess>(next: (param: TSuccess) => Result<USuccess, TError>) =>
    makeRail((param: TParam) => bind(next, fn(param))),

  map: <U>(next: (param: TSuccess) => U) =>
    makeRail((param: TParam) => map(next, fn(param))),

  mapTee: (next: (param: TSuccess) => void) =>
    makeRail((param: TParam) => map((successParam: TSuccess) => tee(next, successParam), fn(param))),

  run: (firstParam: TParam) => fn(firstParam)
})
