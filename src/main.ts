import type { Game, Round } from './types'
import { isSameDay } from './util'
import './style/index.css'

// Main configuration
export const cfg = {
  WORD_LENGTH: 5,
  AVAILABLE_ATTEMPTS: 6,
  COLORS: {
    RED: '#f47068',
    GREEN: '#57ab5a',
    GRAY: '#aeaeae',
  },
}

// Main game state object
export const game: Game = {
  running: false,
  word: '',
  rounds: [],
  win: false,
  timestamps: {
    from: 0,
    to: 0,
  },
}

async function fetchWord(): Promise<string> {
  // Check wether today's word has already been fetched. The reason for
  // that is to prevent getting random word on each page reload. We want
  // to save the word and only refresh it the next day
  const cachedRaw = localStorage.getItem('word')

  // Compare cached timestamps and return cached word or fetch a new one
  if (cachedRaw) {
    const cached = JSON.parse(cachedRaw) as {
      timestamp: number
      word: string
    }
    const timestampNow = new Date()
    const timestampCached = new Date(cached.timestamp)

    if (isSameDay(timestampNow, timestampCached))
      return Promise.resolve(cached.word)
  }

  return fetch(`https://random-word-api.herokuapp.com/word?length=${cfg.WORD_LENGTH}`)
    .then(res => res.json())
    .then(([word]) => {
      // Cache the new word
      localStorage.setItem('word', JSON.stringify({
        word,
        timestamp: Date.now(),
      }))

      return word
    })
    .catch((err) => {
      console.error(err)
    })
}

async function main() {
  // Fetch the word
  const word = await fetchWord()

  // SECTION: LOGGING
  console.log(`${word} ----------`)

  game.running = true
  game.word = word
  game.timestamps.from = Date.now()

  const controller = document.createElement('form-controller')
  const app = document.getElementById('app')

  controller.addEventListener('game-over', () => { })
  controller.addEventListener('round-over', (event) => {
    const { input } = (event as CustomEvent<{ input: string }>).detail

    const round: Round = {
      index: game.rounds.length,
      userGuess: input,
      letters: [],
    }

    // Iterate over each letter in the user input We are checking for if
    // letter is present in the word (anywhere) or if it's the exact
    // match (index of the letter corresponds with the word)
    for (let i = 0; i < cfg.WORD_LENGTH; i++) {
      const letterUser = input.charAt(i)
      const letterActual = word.charAt(i)

      const letterResult = {
        letterActual,
        letterUser,
        isPresent: word.includes(letterUser),
        isExactMatch: letterUser === letterActual,
      }

      round.letters.push(letterResult)
    }

    // SECTION: LOGGING
    console.table(round.letters)

    // Save round
    game.rounds.push(round)

    // Check wether game has been completed (eg. won) We are checking if
    // at least ONE game round has every single letter in the exact match
    const isGameCompleted = game.rounds.some(round => round.letters.every(letter => letter.isExactMatch))

    // SECTION: Game has been won
    if (isGameCompleted) {
      game.win = true
      game.running = false
      game.timestamps.to = Date.now()
      console.log('GAME IS OVER: WON!!!!!!!')
    }

    // SECTION: Game over stuff
    if (!isGameCompleted && cfg.AVAILABLE_ATTEMPTS === game.rounds.length)
      console.log('GAME IS OVER: LOST')
  })

  if (app)
    app.appendChild(controller)
}

// Run the game
main()
