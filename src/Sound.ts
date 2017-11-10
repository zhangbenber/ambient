import { context } from './app'
import Clip from './Clip'

export default class {
	private source: AudioBufferSourceNode = null
	private panner: StereoPannerNode = null
	private gain: GainNode = null

	public volume: number = 1
	public pan: number = 0
	
	constructor(
		readonly clip: Clip
	) {
		clip.addSound(this).then(buffer => {
			this.ready(buffer)
		}, err => {
			console.error(err)
		})
	}

	ready(buffer: AudioBuffer): void {
		this.source = context.createBufferSource()
		this.panner = context.createStereoPanner()
		this.gain = context.createGain()

		this.source.buffer = buffer
		this.source.loop = true

		this.source.connect(this.gain)
		this.gain.connect(this.panner)
		this.panner.connect(context.destination)

		this.source.start()
	}

	private updateAttr(): void {
		
	}

	remove(): void {
		if (!this.source) {
			return
		}
		this.source.stop()
		this.clip.removeSound(this)
		this.source = null
		this.panner = null
		this.gain = null
	}
}