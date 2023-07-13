import type { cfg } from './main'
import { S_GAME, S_HISTORY } from './definitions'
import type { Game } from './types'
import { isSameDay } from './util'

export interface SavedGameState {
  timestamp: number
  game: Game
  cfg: typeof cfg
}

// Saves the result of the game into the localStorage
export function saveGameState(state: SavedGameState): void {
  localStorage.setItem(S_GAME, JSON.stringify(state))
}

// Checks if a saved game state is available
// Clear result if the saved state is not from the CURRENT day
export function getGameState(): SavedGameState | null {
  const result = localStorage.getItem(S_GAME)

  if (!result)
    return null

  const parsedResult = JSON.parse(result) as SavedGameState

  if (!isSameDay(new Date(), new Date(parsedResult.timestamp))) {
    localStorage.removeItem(S_GAME)
    return null
  }

  return parsedResult
}

// Save the current completed game object into
interface GameHistory {
  lastWrite: number
  entries: SavedGameState[]
}

export function getHistory() {
  const history = localStorage.getItem(S_HISTORY)

  if (!history)
    return null

  return JSON.parse(history) as GameHistory
}

export function saveHistoryEntry(state: SavedGameState) {
  const savedHistory = localStorage.getItem(S_HISTORY)
  let history: GameHistory

  if (!savedHistory) {
    history = {
      lastWrite: Date.now(),
      entries: [state],
    }
  }
  else {
    history = JSON.parse(savedHistory) as GameHistory
    history.entries.push(state)
  }

  localStorage.setItem(S_HISTORY, JSON.stringify(history))
}
