import { context } from './app'
import Sound from './Sound'

export default class {
	private buffer: AudioBuffer = null
	private sounds: Array<Sound> = null
	private pending: Array<{
		resolve: (value?: AudioBuffer | PromiseLike<AudioBuffer>) => void,
		reject: (reason?: any) => void
	}> = null

	constructor(
		readonly name: string,
		readonly audio: string = 'default.ogg'
	) { }

	addSound(source: Sound): Promise<AudioBuffer> {
		if (this.sounds === null) {
			this.sounds = []
		}
		if (this.pending === null) {
			this.pending = []
		}
		return new Promise((resolve, reject) => {
			if (this.buffer) {
				resolve(this.buffer)
			} else {
				this.pending.push({ resolve, reject })
				if (this.sounds.length === 0) {
					this.load()
				}
			}
			this.sounds.push(source)
		})
	}

	removeSound(source: Sound): void {
		let index = this.sounds.indexOf(source)
		if (index > -1) {
			this.sounds.splice(index, 1)
		}
		if (this.sounds.length === 0) {
			this.sounds = null
			this.buffer = null
		}
	}

	private load(): void {
		let xhr = new XMLHttpRequest()
		xhr.responseType = 'arraybuffer'
		xhr.onload = () => {
			context.decodeAudioData(xhr.response).then(
				buffer => {
					this.buffer = buffer
					this.pending.forEach(executor => {
						executor.resolve(buffer)
					})
					this.pending = null
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
		this.pending = null
	}
}