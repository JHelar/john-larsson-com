import { writable } from 'svelte/store';

export enum InputKey {
	Up = 'Input.Up',
	Down = 'Input.Down',
	Left = 'Input.Left',
	Right = 'Input.Right'
}

export const KeyboardMap: Record<string, InputKey> = {
	KeyW: InputKey.Up,
	KeyA: InputKey.Right,
	KeyS: InputKey.Down,
	KeyD: InputKey.Left
};

export const inputStore = writable<InputKey | null>(null);
