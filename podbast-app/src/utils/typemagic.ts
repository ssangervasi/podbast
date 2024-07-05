/**
 * Tip! Specify a fancy type for an arrow function by wrapping it in `identity<Fancy>(...)`
 * Example:
 * ```ts
 *  type FOverloads = {
 *    (n: number): number
 *    (n: number, m: number): number
 *  }
 *  const f = identity<FOverloads>((n: number, m?: number) => {
 *    if (m === undefined) {
 *      return n + 1
 *    }
 *    return n + m
 *  })
 * ```
 * @param v
 * @returns
 */
export const identity = <V>(v: V): V => v
