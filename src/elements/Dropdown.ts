import { EVT_GAME_RELOAD_TO_CORE, S_GAME, S_WORD } from '../definitions'
import { MenuIcon } from '../icons'
import { cfg } from '../main'

// Constants
const minWordLength = 3
const maxWordLength = 12
const minAttemptCount = 1
const maxAttemptCount = 16

function generateSelect(textContent: string, min: number, max: number, fn: (event: Event) => void) {
  const el = document.createElement('select')
  el.addEventListener('input', fn)

  const label = document.createElement('label')
  label.textContent = textContent

  for (let i = min; i < max; i++) {
    const option = document.createElement('option')
    option.value = `${i}`
    option.textContent = `${i}`
    el.appendChild(option)
  }

  return {
    label,
    select: el,
  }
}

export class ElDropdown extends HTMLElement {
  open = false
  wrap: HTMLDivElement = document.createElement('div')

  constructor() {
    super()
    // Buttons and inputs for the dropdown
    const lengthSelect = generateSelect(
      'Word Length',
      minWordLength,
      maxWordLength,
      this.__handleWordLengthSelect.bind(this),
    )
    lengthSelect.select.value = `${cfg.WORD_LENGTH}`

    const attemptSelect = generateSelect(
      'Attempts',
      minAttemptCount,
      maxAttemptCount,
      this.__handleAttemptCountSelect.bind(this),
    )
    attemptSelect.select.value = `${cfg.AVAILABLE_ATTEMPTS}`

    //
    const btnRestartGame = document.createElement('button')
    btnRestartGame.innerText = 'Start Again'
    btnRestartGame.addEventListener('click', this.__handleRestartGame)

    const btnRefreshGame = document.createElement('button')
    btnRefreshGame.innerText = 'New Word'
    btnRefreshGame.addEventListener('click', this.__handleRefreshGame)

    this.wrap.classList.add('drp-wrap')

    // Add any element to be displayed within the dropdown
    this.wrap.append(
      attemptSelect.label,
      attemptSelect.select,
      lengthSelect.label,
      lengthSelect.select,
      btnRefreshGame,
      btnRestartGame,
    )

    const trigger = document.createElement('button')
    trigger.innerHTML = MenuIcon
    trigger.classList.add('drp-trigger')
    trigger.addEventListener('click', () => this.toggle())

    this.append(trigger, this.wrap)
  }

  toggle() {
    this.open = !this.open
    this.wrap.style.display = this.open ? 'block' : 'none'
  }

  sendReloadEvent() {
    this.dispatchEvent(new CustomEvent(EVT_GAME_RELOAD_TO_CORE, {
      composed: true,
      bubbles: true,
    }))
  }

  // Changed the word length
  __handleWordLengthSelect(event: Event) {
    cfg.WORD_LENGTH = Number((event.target as HTMLSelectElement).value)
    localStorage.removeItem(S_GAME)
    localStorage.removeItem(S_WORD)
    this.sendReloadEvent()
  }

  // Changed the amount of attempts
  __handleAttemptCountSelect(event: Event) {
    cfg.AVAILABLE_ATTEMPTS = Number((event.target as HTMLSelectElement).value)
    localStorage.removeItem(S_GAME)
    this.sendReloadEvent()
  }

  // Restart the game and get an new word
  __handleRefreshGame() {
    // remove S_GAME, S_WORD
  }

  // Restart the game (but keep the word)
  __handleRestartGame() {
    // Remove S_GAME
  }
}
