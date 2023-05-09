import { Result, result } from "./result"

export const makeRail = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => Result<TSuccess, TFailure>
) => ({
  then: <USuccess>(next: (param: TSuccess) => Result<USuccess, TFailure>) =>
    makeRail<TParam, USuccess, TFailure>((param: TParam) => result.bind(next, fn(param))),

  map: <U>(next: (param: TSuccess) => U) =>
    makeRail<TParam, U, TFailure>((param: TParam) => result.map<TSuccess, U, TFailure>(next, fn(param))),

  tee: (next: (param: TSuccess) => void) =>
    makeRail((param: TParam) => result.tee(next, fn(param))),

  teeError: (nextError: (param: TFailure) => void) =>
    makeRail((param: TParam) => result.teeError(nextError, fn(param))),

  finally: <T>(last: (result: Result<TSuccess, TFailure>) => T) => ({
    run: (firstParam: TParam) => last(fn(firstParam))
  }),

  run: (firstParam: TParam) => fn(firstParam)
})
