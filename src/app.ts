import Clip from './Clip'
import Sound from './Sound'
import Controller from './Controller'

let context: AudioContext = new AudioContext()
let field: HTMLDivElement = document.createElement('div')
field.className = 'field'
document.body.appendChild(field)

let clips: Array<Clip> = [
	new Clip('White Noise')
]

let ctrl = new Controller(clips[0])

export { context, field }