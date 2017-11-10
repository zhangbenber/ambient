import Clip from './Clip'

export default class {
	private source: AudioBufferSourceNode
	private panner: StereoPannerNode
	private gain: GainNode
	
	constructor(
		private context: AudioContext,
		public clip: Clip,

	) {
		clip.addSource(this).then(buffer => {
			this.ready(buffer)
		}, err => {
			console.error(err)
		})
	}

	ready(buffer: AudioBuffer): void {
		this.source = this.context.createBufferSource()
		this.panner = this.context.createStereoPanner()
		this.gain = this.context.createGain()

		this.source.buffer = buffer
		this.source.loop = true

		this.source.connect(this.gain)
		this.gain.connect(this.panner)
		this.panner.connect(this.context.destination)

		this.source.start()
	}
}