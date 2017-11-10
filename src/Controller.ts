import Clip from './Clip'
import Sound from './Sound'
import { field } from './app'

const padding = 50
let downCtrl: Controller = null
let downPos: Position = null

let getPos = (e: MouseEvent): Position => ({
	x: e.clientX / (field.clientWidth - padding * 2),
	y: e.clientY / (field.clientHeight - padding * 2)
})

field.onmousedown = (e: MouseEvent) => {
	downPos = getPos(e)
}

field.onmousemove = (e: MouseEvent) => {
	if (downPos && downCtrl) {
		let pos: Position = getPos(e)
		downCtrl.pos = new Position(
			Math.max(0, Math.min(1, downCtrl.pos.x - downPos.x + pos.x)),
			Math.max(0, Math.min(1, downCtrl.pos.y - downPos.y + pos.y))
		)
		downPos = getPos(e)
		downCtrl.update()
	}
}

field.onmouseup = (e: MouseEvent) => {
	if (downCtrl) {
		downPos = null
		downCtrl = null
	}
}

class Position {
	constructor(public x: number = 0.5, public y: number = 0.5) { }
}

class Controller {
	private elem: HTMLDivElement = document.createElement('div')
	private sound: Sound
	public pos: Position = new Position()

	constructor(
		readonly clip: Clip,
	) {
		this.elem.className = 'ctrl'
		this.elem.style.backgroundColor = clip.color
		this.elem.style.backgroundImage = `url(assets/${clip.icon})`
		this.elem.onmousedown = () => {
			downCtrl = this
		}
		field.appendChild(this.elem)

		this.sound = new Sound(clip)
		this.update()
		this.sound.start()

		setTimeout(() => {
			this.elem.style.opacity = '1'
		}, 10)
	}

	update(): void {
		this.elem.style.left = `${(field.clientWidth - padding * 2) * this.pos.x + padding}px`
		this.elem.style.top = `${(field.clientHeight - padding * 2) * this.pos.y + padding}px`
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

}
export default Controller