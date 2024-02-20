import { writable } from 'svelte/store';

export enum InputKey {
	Up = 'Input.Up',
	Down = 'Input.Down',
	Left = 'Input.Left',
	Right = 'Input.Right',
	RotateRight = 'Input.RotateRight',
	RotateLeft = 'Input.RotateLeft',
	RotateUp = 'Input.RotateUp',
	RotateDown = 'Input.RotateDown'
}

export const KeyboardMap: Record<string, InputKey> = {
	KeyW: InputKey.Up,
	KeyA: InputKey.Left,
	KeyS: InputKey.Down,
	KeyD: InputKey.Right,
	ArrowRight: InputKey.RotateRight,
	ArrowLeft: InputKey.RotateLeft,
	ArrowUp: InputKey.RotateUp,
	ArrowDown: InputKey.RotateDown
};

export const inputStore = writable<InputKey | null>(null);
