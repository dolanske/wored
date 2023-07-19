export declare class ElRow extends HTMLElement {
    #private;
    input: string;
    isActive: boolean;
    cells: HTMLDivElement[];
    constructor();
    connectedCallback(): void;
    __handleLetter(event: Event): void;
    __handleBackspace(): void;
    __handleEnter(event: Event): Promise<void>;
    disconnectedCallback(): void;
    setInputStatusAtIndex(index: number, color: string): void;
}
