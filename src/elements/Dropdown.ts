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
  trigger: HTMLButtonElement = document.createElement('button')

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
    attemptSelect.select.value = `${cfg.MAX_ATTEMPTS}`

    //
    const btnRestartGame = document.createElement('button')
    btnRestartGame.textContent = 'Restart'
    btnRestartGame.addEventListener('click', this.__handleRestartGame.bind(this))

    const btnRefreshGame = document.createElement('button')
    btnRefreshGame.textContent = 'New Word'
    btnRefreshGame.addEventListener('click', this.__handleRefreshGame.bind(this))

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

    this.trigger.innerHTML = MenuIcon
    this.trigger.classList.add('drp-trigger')
    this.trigger.addEventListener('click', this.toggle.bind(this))

    this.append(this.trigger, this.wrap)
  }

  toggle() {
    this.open = !this.open
    this.wrap.style.display = this.open ? 'block' : 'none'
    this.trigger.classList.toggle('active')
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
    this.toggle()
    this.sendReloadEvent()
  }

  // Changed the amount of attempts
  __handleAttemptCountSelect(event: Event) {
    cfg.MAX_ATTEMPTS = Number((event.target as HTMLSelectElement).value)
    localStorage.removeItem(S_GAME)
    this.toggle()
    this.sendReloadEvent()
  }

  // Restart the game and get an new word
  __handleRefreshGame() {
    // remove S_GAME, S_WORD
    localStorage.removeItem(S_GAME)
    localStorage.removeItem(S_WORD)
    this.toggle()
    this.sendReloadEvent()
  }

  // Restart the game (but keep the word)
  __handleRestartGame() {
    // Remove S_GAME
    localStorage.removeItem(S_GAME)
    this.toggle()
    this.sendReloadEvent()
  }
}
