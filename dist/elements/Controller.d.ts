import { Letter } from '../types';
import { ElRow } from './Row';
export declare class ElController extends HTMLElement {
    activeRowIndex: number;
    rows: ElRow[];
    constructor();
    connectedCallback(): void;
    updateListeners(): void;
    __rowSubmitHandler(event: Event): void;
    endOfRound(roundResult: Letter[]): void;
}
