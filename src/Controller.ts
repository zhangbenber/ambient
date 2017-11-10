import Clip from './Clip'
import Sound from './Sound'
import { field } from './app'

class Position {
	constructor(public x: number = 0.5, public y: number = 0.5) { }
}

export default class {
	private elem: HTMLDivElement = document.createElement('div')
	private sound: Sound
	private pos: Position = new Position()
	private downPos: Position = null
	
	private readonly padding = 50
	
	constructor(
		readonly clip: Clip,
	) {
		this.elem.className = 'ctrl'
		this.elem.style.backgroundColor = clip.color
		this.elem.style.backgroundImage = `url(assets/${clip.icon})`
		this.elem.onmousedown = this.mousedownHandler
		this.elem.onmousemove = this.mousemoveHandler
		this.elem.onmouseup = this.mouseupHandler
		field.appendChild(this.elem)

		this.sound = new Sound(clip)
		this.update()
		this.sound.start()

		setTimeout(() => {
			this.elem.style.opacity = '1'
		}, 10)
	}

	update(): void {
		this.elem.style.left = `${(field.clientWidth - this.padding * 2) * this.pos.x + this.padding}px`
		this.elem.style.top = `${(field.clientHeight - this.padding * 2) * this.pos.y + this.padding}px`
		if (this.sound) {
			this.sound.volume = (1 - this.pos.y) ** 1.5
			this.sound.pan = this.pos.x * 2 - 1
		}
	}

	remove(): void {
		this.sound.stop()
		this.elem.style.opacity = '0'

		setTimeout(() => {
			field.removeChild(this.elem)
			this.elem = null
		}, 1000)
	}

	private getPos = (e: MouseEvent): Position => ({
		x: e.pageX / (field.clientWidth - this.padding * 2),
		y: e.pageY / (field.clientHeight - this.padding * 2)
	})

	private mousedownHandler = (e: MouseEvent) => {
		this.downPos = this.getPos(e)
		console.log(1)
	}

	private mousemoveHandler = (e: MouseEvent) => {
		if (this.downPos) {
			let pos: Position = this.getPos(e)
			this.pos = new Position(
				Math.max(0, Math.min(1, this.pos.x - this.downPos.x + pos.x)),
				Math.max(0, Math.min(1, this.pos.y - this.downPos.y + pos.y))
			)
			this.downPos = this.getPos(e)
			this.update()
		}
	}

	private mouseupHandler = (e: MouseEvent) => {
		this.downPos = null
	}
}