import { context } from './app'
import Clip from './Clip'

export default class {
	private _volume: number = 1
	private _pan: number = 0

	private source: AudioBufferSourceNode = null
	private panner: StereoPannerNode = null
	private gain: GainNode = null
	private fader: GainNode = null
	
	constructor(
		readonly clip: Clip
	) {	}

	get pan(): number {
		return this._pan
	}

	set pan(pan: number) {
		this._pan = pan
		this.updateAttr()
	}

	get volume(): number {
		return this._volume
	}

	set volume(volume: number) {
		this._volume = volume
		this.updateAttr()
	}

	ready(buffer: AudioBuffer): void {
		this.source = context.createBufferSource()
		this.panner = context.createStereoPanner()
		this.gain = context.createGain()
		this.fader = context.createGain()

		this.source.buffer = buffer
		this.source.loop = true

		this.source.connect(this.gain)
		this.gain.connect(this.panner)
		this.panner.connect(this.fader)
		this.fader.connect(context.destination)

		this.fader.gain.value = 0
		this.fader.gain.linearRampToValueAtTime(1, context.currentTime + 1)

		this.updateAttr()
		this.source.start()
	}

	private updateAttr(): void {
		if (!this.source) {
			return
		}
		this.panner.pan.value = this._pan
		this.gain.gain.value = this._volume * 0.5 * this.clip.volume
	}

	start(): void {
		this.clip.addSound(this).then(buffer => {
			this.ready(buffer)
		}, err => {
			console.error(err)
		})
	}

	stop(): void {
		if (!this.source) {
			return
		}
		this.clip.removeSound(this)
		this.fader.gain.linearRampToValueAtTime(0, context.currentTime + 1)
		this.panner = null
		this.gain = null
		this.fader = null
		setTimeout(() => {
			this.source.stop()
			this.source = null
		}, 2000)
	}
}