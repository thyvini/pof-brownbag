import { Result, result } from "./result"

type ResultOrPromise<TSuccess, TFailure> = Result<TSuccess, TFailure> | Promise<Result<TSuccess, TFailure>>
type PromiseOr<T> = T | Promise<T>

export const makeRail = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => Result<TSuccess, TFailure>
) => ({
  then: <USuccess>(next: (param: TSuccess) => Result<USuccess, TFailure>) =>
    makeRail((param: TParam) => result.bind(next, fn(param))),

  map: <U>(next: (param: TSuccess) => U) =>
    makeRail((param: TParam) => result.map<TSuccess, U, TFailure>(next, fn(param))),

  tee: (next: (param: TSuccess) => void) =>
    makeRail((param: TParam) => result.tee(next, fn(param))),

  teeError: (nextError: (param: TFailure) => void) =>
    makeRail((param: TParam) => result.teeError(nextError, fn(param))),

  finally: <T>(last: (result: Result<TSuccess, TFailure>) => T) => ({
    run: (firstParam: TParam) => last(fn(firstParam))
  }),

  run: (firstParam: TParam) => fn(firstParam),
})

export const makeAsyncRail = <TParam, TSuccess, TFailure>(
  fn: (param: TParam) => ResultOrPromise<TSuccess, TFailure>
) => ({
  then: <USuccess>(next: (param: TSuccess) => ResultOrPromise<USuccess, TFailure>) =>
    makeAsyncRail(async (param: TParam) => result.bindAsync(async (param) => next(param), await fn(param))),

  map: <U>(next: (param: TSuccess) => PromiseOr<U>) =>
    makeAsyncRail(async (param: TParam) => result.mapAsync(async (param) => next(param), await fn(param))),

  tee: (next: (param: TSuccess) => PromiseOr<void>) =>
    makeAsyncRail(async (param: TParam) => result.teeAsync(async (param) => next(param), await fn(param))),

  teeError: (nextError: (param: TFailure) => PromiseOr<void>) =>
    makeAsyncRail(async (param: TParam) => result.teeErrorAsync(async (param) => nextError(param), await fn(param))),
  
  finally: <T>(last: (result: Result<TSuccess, TFailure>) => PromiseOr<T>) => ({
    run: async (firstParam: TParam) => last(await fn(firstParam))
  }),

  run: async (firstParam: TParam) => fn(firstParam),
})
