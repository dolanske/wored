import { EVT_BACKSPACE, EVT_ENTER, EVT_LETTER } from '../definitions'
import type { Letter } from '../types'
import { getColorFromResult } from '../util'

// # is 'Backspace' key
// $ is 'Enter' key
const buttonString = 'qwertyuiopasdfghjkl$zxcvbnm#'

export class ElKeyboard extends HTMLElement {
  buttons: HTMLButtonElement[]

  constructor() {
    super()

    // Generate keyboard keys
    this.buttons = buttonString.split('').map((char) => {
      const el = document.createElement('button')

      if (char === '$') {
        // Enter key
        el.textContent = 'ENTER'
        el.addEventListener('click', this.__enterHandler)
      }
      else if (char === '#') {
        // Backaspace key
        el.textContent = 'DELETE'
        el.addEventListener('click', this.__backspaceHandler)
      }
      else {
        // Normal letter key
        el.textContent = char.toUpperCase()
        el.addEventListener('click', () => this.__letterHandler(char))
      }

      return el
    })

    document.addEventListener('keydown', e => this.__keyPressHandler(e))
  }

  connectedCallback() {
    this.append(...this.buttons)
  }

  // Iterates over letters and assigns their colors based on the results
  highlightLetters(letters: Letter[]) {
    for (const result of letters) {
      const color = getColorFromResult(result)
      const index = buttonString.indexOf(result.letterUser)
      this.buttons[index].classList.add(color)
    }
  }

  // Will disable any interaction after game has concluded
  disable() {
    for (const btn of this.buttons) {
      btn.removeEventListener('click', this.__enterHandler)
      btn.removeEventListener('click', this.__backspaceHandler)
      btn.removeEventListener('click', () => this.__letterHandler(''))
      btn.setAttribute('disabled', 'true')
    }

    document.removeEventListener('keydown', e => this.__keyPressHandler(e))
  }

  // Send the character into the row element
  __letterHandler(char: string) {
    const emit = new CustomEvent(EVT_LETTER, {
      detail: { char },
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(emit)
  }

  // Submit the current row
  __enterHandler() {
    const emit = new CustomEvent(EVT_ENTER, {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(emit)
  }

  // If current active index has a letter, remove it
  __backspaceHandler() {
    const emit = new CustomEvent(EVT_BACKSPACE, {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(emit)
  }

  // Allows users to type on their keyboard
  __keyPressHandler(event: KeyboardEvent) {
    const { key } = event
    if (buttonString.includes(key))
      this.__letterHandler(key)
    else if (key === 'Backspace')
      this.__backspaceHandler()
    else if (key === 'Enter')
      this.__enterHandler()
  }
}
