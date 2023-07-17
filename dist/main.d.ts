import type { Game } from './types';
export declare const cfg: {
    WORD_LENGTH: number;
    MAX_ATTEMPTS: number;
};
export declare const game: Game;
export declare function run(mountTo: string): Promise<void>;
