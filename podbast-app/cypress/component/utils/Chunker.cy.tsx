import { useState } from 'preact/hooks'
import { useChunker } from '../../../src/utils/useChunker'

const ChunkerTest = () => {
	const [items] = useState(() => ['a', 'b', 'c', 'd'])
	const chunker = useChunker({ items, size: 2 })

	return (
		<div>
			<div>{chunker.chunk.join(',')}</div>
			<div>{JSON.stringify(chunker.chunkInfo)}</div>
		</div>
	)
}
describe('Chunker.cy.tsx', () => {
	it('playground', () => {
		cy.mount(<ChunkerTest />)
	})
})
