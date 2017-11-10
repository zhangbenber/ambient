import Source from './Source'

export default class {
	buffer: AudioBuffer = null
	private sources: Array<Source> = null
	private pending: Array<{
		resolve: (value?: AudioBuffer | PromiseLike<AudioBuffer>) => void,
		reject: (reason?: any) => void
	}> = null

	constructor(
		public context: AudioContext,
		public name: string,
		public audio: string = 'default.ogg'
	) { }

	addSource(source: Source): Promise<AudioBuffer> {
		if (this.sources === null) {
			this.sources = []
		}
		if (this.pending === null) {
			this.pending = []
		}
		return new Promise((resolve, reject) => {
			if (this.buffer) {
				resolve(this.buffer)
			} else {
				this.pending.push({ resolve, reject })
				if (this.sources.length === 0) {
					this.load()
				}
			}
			this.sources.push(source)
		})
	}

	private load(): void {
		let xhr = new XMLHttpRequest()
		xhr.responseType = 'arraybuffer'
		xhr.onload = () => {
			this.context.decodeAudioData(xhr.response).then(
				buffer => {
					this.buffer = buffer
					this.pending.forEach(executor => {
						executor.resolve(buffer)
					})
				},
				err => this.handleError(err)
			)
		}
		xhr.onerror = event => {
			this.handleError(event.error)
		}
		xhr.open('GET', `assets/${this.audio}`)
		xhr.send(null)
	}

	private handleError(err: any): void {
		this.pending.forEach(executor => {
			executor.reject(err)
		})
	}
}