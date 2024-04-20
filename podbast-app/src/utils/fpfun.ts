type Stuff = { a: number; b: number }

const _doer = (stuff: Stuff, other: number) => {
	const { a, b } = stuff
	return a + b + other
}

const _wrap = (stuff: Partial<Stuff>) => {
	const fullStuff = { a: 0, b: 0, ...stuff }
	const doer = (other: number) => _doer(fullStuff, other)

	const wrappedDoer = Object.assign(doer, {
		wrap: (innerStuff: Partial<Stuff>) => _wrap({ ...stuff, ...innerStuff }),
	})

	return wrappedDoer
}

const _test = () => {
	const f = _wrap({ a: 1 })
	const g = f.wrap({ b: 2 })
	g(3)
}
