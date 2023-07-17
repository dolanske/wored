export interface Letter {
  letterUser: string
  letterActual: string
  isPresent: boolean
  isExactMatch: boolean
}

export interface Round {
  index: number
  userGuess: string
  letters: Letter[]
}

export interface Game {
  running: boolean
  word: string
  rounds: Round[]
  win: boolean
  timestamps: {
    from: number
    to: number
  }
}

// Util
export type ValueOf<T> = T[keyof T]
