// $ is 'Enter' key

import { CLS_COLORS, EVT_BACKSPACE, EVT_ENTER, EVT_LETTER } from '../shared'
import type { Letter } from '../types'

// # is 'Backspace' key
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
  }

  connectedCallback() {
    this.append(...this.buttons)
  }

  // Iterates over letters and assigns their colors based on the results
  highlightLetters(letters: Letter[]) {
    for (const result of letters) {
      const color = (result.isPresent
        ? result.isExactMatch
          ? CLS_COLORS.green
          : CLS_COLORS.orange
        : CLS_COLORS.gray) as keyof typeof CLS_COLORS

      const index = buttonString.indexOf(result.letterUser)
      this.buttons[index].classList.add(color)
    }
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
    const emit = new CustomEvent(EVT_ENTER, { bubbles: false })
    window.dispatchEvent(emit)
  }

  // If current active index has a letter, remove it
  __backspaceHandler() {
    const emit = new CustomEvent(EVT_BACKSPACE, { bubbles: false })
    window.dispatchEvent(emit)
  }
}
