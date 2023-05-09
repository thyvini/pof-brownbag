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

const isSuccess = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>) =>
  result.kind === 'success'

const isFailure = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>) =>
  result.kind === 'failure'

const toSuccessOrNull = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>) =>
  result.kind === 'success' ? result.success : null

const toFailureOrNull = <TSuccess, TFailure>(result: Result<TSuccess, TFailure>) =>
  result.kind === 'failure' ? result.failure : null

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
      return success<TSuccess, TFailure>(fn(anterior.success))
    case 'failure':
      return anterior
  }
}

const tee = <TParam, TFailure>(
  fn: (param: TParam) => void,
  anterior: Result<TParam, TFailure>
) => {
  switch (anterior.kind) {
    case 'success':
      fn(anterior.success)
      return success<TParam, TFailure>(anterior.success)
    case 'failure':
      return anterior
  }
}

const teeError = <TSuccess, TFailure>(
  fn: (param: TFailure) => void,
  anterior: Result<TSuccess, TFailure>
) => {
  switch (anterior.kind) {
    case 'failure':
      fn(anterior.failure)
      return failure<TSuccess, TFailure>(anterior.failure)
    case 'success':
      return anterior
  }
}

export const result = {
  isSuccess,
  isFailure,
  toSuccessOrNull,
  toFailureOrNull,
  bind,
  map,
  tee,
  teeError,
}
