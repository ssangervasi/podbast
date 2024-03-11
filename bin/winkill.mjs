#!/usr/bin/env node
import netstat from 'node-netstat'
import ps from 'ps-node'

netstat.parsers.win32 = netstat.parserFactories.win32({
	parseName: true,
})

const matches = []

netstat(
	{
		sync: true,
	},
	item => {
		const { port } = item.local
		if (42990 <= port && port <= 42999) {
			matches.push(item)
			console.log(item.pid, item.state)
		}
	},
)

console.log('Killing processes', matches.length)

matches.forEach(item => {
	ps.kill(item.pid)
})
