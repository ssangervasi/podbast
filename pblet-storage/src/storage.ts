export class Storage {
	interval: number | undefined
	activeStore = false

	loadStore() {}

	tryStore() {
		if (this.activeStore) {
			return
		}

		try {
			this.activeStore = true

			this.doStore()
		} finally {
			this.activeStore = false
		}
	}

	doStore() {}

	mount() {
		setInterval(() => {
			this.tryStore()
		}, 500)
	}

	unmount() {}
}
