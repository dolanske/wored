import type { Game, Round } from './types'
import { CLS_COLORS, CLS_GAME_SCOPE, CLS_LOSING_ROW, CLS_WINNING_ROW, EVT_GAME_RELOAD_TO_CORE, EVT_ROW_SUBMIT_TO_CORE, S_WORD } from './definitions'
import { register } from './dom'
import { ElController } from './elements/Controller'
import { ElDropdown } from './elements/Dropdown'
import { ElKeyboard } from './elements/Keyboard'
import { getGameState, saveGameState, saveHistoryEntry } from './results'
import { countLetter, getColorFromResult, isSameDay } from './util'
import './style/index.css'

// Main configuration
export const cfg = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6,
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
  // Check wether today's word has already been fetched. The reason for that is
  // to prevent getting random word on each page reload. We want to save the
  // word and only refresh it the next day
  const cachedRaw = localStorage.getItem(S_WORD)

  // Compare cached timestamps and return cached word or fetch a new one
  if (cachedRaw) {
    const cached = JSON.parse(cachedRaw) as {
      timestamp: number
      word: string
      length: number
    }
    const timestampNow = new Date()
    const timestampCached = new Date(cached.timestamp)

    if (isSameDay(timestampNow, timestampCached) && cached.length === cfg.WORD_LENGTH)
      return Promise.resolve(cached.word)
  }

  return fetch(`https://random-word-api.herokuapp.com/word?length=${cfg.WORD_LENGTH}`)
    .then(res => res.json())
    .then(([word]) => {
      // Cache the new word
      localStorage.setItem(S_WORD, JSON.stringify({
        word,
        timestamp: Date.now(),
        length: cfg.WORD_LENGTH,
      }))

      return word
    })
    .catch((err) => {
      console.error(err)
    })
}

export async function run(mountTo: string) {
  // Registers UI components
  register()

  console.clear()

  // Get cached game state and assign it
  const cachedState = getGameState()

  // Fetch the word or assign it from cached satte
  const word = cachedState ? cachedState.game.word : await fetchWord()

  // SECTION: LOGGING
  console.log(`---------- New Game: "${word}" ----------`)

  // Assign cached state before components are rendered, in case they take use
  // the global state
  if (cachedState) {
    Object.assign(game, cachedState.game)
    Object.assign(game.timestamps, cachedState.game.timestamps)
    Object.assign(cfg, cachedState.cfg)
  }
  else {
    game.running = true
    game.word = word
    game.timestamps.from = Date.now()
  }

  let Controller = new ElController()
  let Keyboard = new ElKeyboard()
  const Dropdown = new ElDropdown()
  const App = document.querySelector(mountTo)

  if (cachedState)
    Controller.activeRowIndex = cachedState.game.rounds.length

  App?.append(Controller, Keyboard, Dropdown)
  App?.classList.add(CLS_GAME_SCOPE)

  // This will write the progress of the cached game so far into the controller
  if (cachedState) {
    // Update Row UI
    if (!cachedState.game.running)
      Keyboard.disable()

    for (let i = 0; i < cachedState.game.rounds.length; i++) {
      const row = Controller.rows[i]
      const round = cachedState.game.rounds[i]
      let winningRow = true

      row.isActive = false
      row.input = round.userGuess

      for (let i = 0; i < round.letters.length; i++) {
        const letter = round.letters[i]
        const cell = row.cells[i]
        cell.textContent = letter.letterUser

        const color = getColorFromResult(letter)
        row.setInputStatusAtIndex(i, color)

        if (color !== CLS_COLORS.green)
          winningRow = false
      }

      if (winningRow)
        row.classList.add(CLS_WINNING_ROW)
      else if ((i + 1) === cfg.MAX_ATTEMPTS)
        row.classList.add(CLS_LOSING_ROW)

      Keyboard.highlightLetters(round.letters)
    }
  }

  // Is called whenever a valid user input has been submitted
  document.addEventListener(EVT_ROW_SUBMIT_TO_CORE, (event) => {
    const { input } = (event as CustomEvent<{ input: string }>).detail
    const round: Round = {
      index: game.rounds.length,
      userGuess: input,
      letters: [],
    }

    
    // Iterate over each letter in the user input We are checking for if letter
    // is present in the word or if it's the exact match (index of
    // the letter corresponds with the word)
    
    const letterIndex: Record<string, number> = {}
    // This loop also makes sure only the correct amount of letters are
    // highlighted and that it doesn't hint there are more letters in the word
    // than there are
    for (let i = 0; i < cfg.WORD_LENGTH; i++) {
      const letterUser = input.charAt(i)
      const letterActual = game.word.charAt(i)

      if (letterIndex[letterUser] === undefined)
        // Store the total count of said letter in the word
        letterIndex[letterUser] = countLetter(game.word, letterUser) - 1
      else
        letterIndex[letterUser]--

      const letterResult = {
        letterActual,
        letterUser,
        // Only set if it's present, if the correct amount hasn't been met yet
        isPresent: letterIndex[letterUser] >= 0,
        isExactMatch: letterUser === letterActual,
      }

      round.letters.push(letterResult)
    }

    // SECTION: LOGGING
    console.log('Round results')
    console.table(round.letters)

    // Save round
    game.rounds.push(round)
    Controller.endOfRound(round.letters)
    Keyboard.highlightLetters(round.letters)

    // Check wether game has been completed (eg. won) We are checking if at
    // least ONE game round has every single letter in the exact match
    checkAndHandleGameOver()
  })

  // Is called when a game property has been changed
  document.addEventListener(EVT_GAME_RELOAD_TO_CORE, async () => {
    // 1. Fetch new word, the handler will automatically remove the
    //    cached word if needed
    game.word = await fetchWord()
    game.rounds = []
    game.timestamps.from = Date.now()
    game.running = true

    // SECTION: LOGGING
    console.log(`---------- New Game: "${game.word}" ----------`)
    // 2. Reset all UI without reloading the page. We can re-initialize all the
    //    elements by first letting them remove themselves, their child nodes
    //    and then replacing them with a new instance

    Controller.replaceChildren()
    Controller.remove()

    Keyboard.replaceChildren()
    Keyboard.remove()

    requestAnimationFrame(() => {
      Controller = new ElController()
      Keyboard = new ElKeyboard()
      App?.append(Controller, Keyboard)
    })
  })

  function checkAndHandleGameOver() {
    const isGameCompleted = game.rounds.some(round => round.letters.every(letter => letter.isExactMatch))

    // Return if game has not completed its final round
    if (cfg.MAX_ATTEMPTS !== game.rounds.length && !isGameCompleted) {
      // Save the current game state at the end of each round The code is
      // duplicated because we want to explicity change if game is running or
      // not still running === game isn't completed
      saveGameState({ game, cfg, timestamp: Date.now() })
      return
    }

    game.running = false
    game.timestamps.to = Date.now()
    Keyboard.disable()

    // SECTION: Game over: WIN
    if (isGameCompleted) {
      game.win = true
      console.log(`[${game.word}] Game over! You won!`)
    }

    // SECTION: Game over: LOST
    if (!isGameCompleted)
      console.log(`[${game.word}] Game over! You lost`)

    // Save history entry only when game has ended
    // REVIEW: we could have added
    // saveGameState() to history function too but this is cleaner as these
    // functions shouldn't produce side effects
    const finalGameObject = { game, cfg, timestamp: Date.now() }
    saveGameState(finalGameObject)
    saveHistoryEntry(finalGameObject)
  }
}

run('#app')
