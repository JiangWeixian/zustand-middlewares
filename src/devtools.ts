// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- StoreMutators is not compatiable TODO: fix types
// MIT License

// Copyright (c) 2019 Paul Henschel

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import type { StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand'

// Browser follow type definition of devtools middlewares
// refs: https://github.com/pmndrs/zustand/blob/main/src/middleware/devtools.ts
type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, [...Mps, ['zustand-middlewares-logger', never]], Mcs>,
  options: {
    name?: string
  }
) => StateCreator<T, Mps, [['zustand-middlewares-logger', never], ...Mcs]>

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  options: {
    name?: string
  }
) => StateCreator<T, [], []>

type Cast<T, U> = T extends U ? T : U
type Write<T, U> = Omit<T, keyof U> & U
type TakeTwo<T> = T extends { length: 0 }
  ? [undefined, undefined]
  : T extends { length: 1 }
    ? [...a0: Cast<T, unknown[]>, a1: undefined]
    : T extends { length: 0 | 1 }
      ? [...a0: Cast<T, unknown[]>, a1: undefined]
      : T extends { length: 2 }
        ? T
        : T extends { length: 1 | 2 }
          ? T
          : T extends { length: 0 | 1 | 2 }
            ? T
            : T extends [infer A0, infer A1, ...unknown[]]
              ? [A0, A1]
              : T extends [infer A0, (infer A1)?, ...unknown[]]
                ? [A0, A1?]
                : T extends [(infer A0)?, (infer A1)?, ...unknown[]]
                  ? [A0?, A1?]
                  : never

type WithLogger<S> = Write<S, StoreLogger<S>>

type StoreLogger<S> = S extends {
  setState: (...a: infer Sa) => infer Sr
}
  ? {
      setState<A extends string | { type: unknown }>(
        ...a: [...a: TakeTwo<Sa>, action?: A]
      ): Sr
    }
  : never
export type NamedSet<T> = WithLogger<StoreApi<T>>['setState']

declare module 'zustand' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StoreMutators<S, A> {
    'zustand-middlewares-logger': WithLogger<S>
  }
}
interface Action<T = any> {
  type: T
}

const loggerImpl: LoggerImpl = (f, options) => (set, get, store) => {
  type T = ReturnType<typeof f>
  const loggedSet: NamedSet<T> = (state, replace, nameOrAction) => {
    const action: Action<unknown>
      = nameOrAction === undefined
        ? { type: 'anonymous' }
        : typeof nameOrAction === 'string'
          ? { type: nameOrAction }
          : nameOrAction
    console.group(`%c action: ${options.name} : ${action.type}`, 'font-weight: bold;')
    console.log('%c prev state:', 'color: gray; font-weight: bold;', get())
    console.log('%c action:', 'color: #0066db; font-weight: bold;', action)
    set(state, replace)
    console.log('%cnext state:', 'color: #006b3b; font-weight: bold;', get())
    console.groupEnd()
  }
  store.setState = loggedSet

  return f(loggedSet, get, store)
}

export const logger = loggerImpl as unknown as Logger
