import { Timer as THREETimer } from 'three/addons/misc/Timer.js';

export class Timer {
	private static timer = new THREETimer();

	public static update() {
		Timer.timer.update();
	}

	public static get time() {
		return Timer.timer.getElapsed();
	}
}
