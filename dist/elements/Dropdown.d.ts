export declare class ElDropdown extends HTMLElement {
    open: boolean;
    wrap: HTMLDivElement;
    trigger: HTMLButtonElement;
    constructor();
    toggle(): void;
    sendReloadEvent(): void;
    __handleWordLengthSelect(event: Event): void;
    __handleAttemptCountSelect(event: Event): void;
    __handleRefreshGame(): void;
    __handleRestartGame(): void;
}
