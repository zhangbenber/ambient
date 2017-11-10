import Clip from './Clip'
import Source from './Source'

let context: AudioContext = new AudioContext()

let clips: Array<Clip> = [
	new Clip(context, 'test')
]

new Source(context, clips[0])