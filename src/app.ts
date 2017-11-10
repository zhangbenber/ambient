import Clip from './Clip'
import Sound from './Sound'

let context: AudioContext = new AudioContext()

let clips: Array<Clip> = [
	new Clip('test')
]

let source = new Sound(clips[0])
setTimeout(() => {
	source.remove()
	source = null
}, 2000)

export { context }