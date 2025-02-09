import { cfg } from './main';
import { Game } from './types';
export interface SavedGameState {
    timestamp: number;
    game: Game;
    cfg: typeof cfg;
}
export declare function saveGameState(state: SavedGameState): void;
export declare function getGameState(): SavedGameState | null;
interface GameHistory {
    lastWrite: number;
    entries: SavedGameState[];
}
export declare function getHistory(): GameHistory | null;
export declare function saveHistoryEntry(state: SavedGameState): void;
export {};
