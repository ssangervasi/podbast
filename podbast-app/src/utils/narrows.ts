import { type Narrower, some } from 'narrow-minded'

// Should have put this in narrow-minded to begin with
export const optional = <N extends Narrower>(n: N) => some('undefined', n)
