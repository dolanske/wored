import type { Letter } from '../types';
export declare class ElKeyboard extends HTMLElement {
    buttons: HTMLButtonElement[];
    constructor();
    connectedCallback(): void;
    highlightLetters(letters: Letter[]): void;
    disable(): void;
    __letterHandler(char: string): void;
    __enterHandler(): void;
    __backspaceHandler(): void;
    __keyPressHandler(event: KeyboardEvent): void;
}
