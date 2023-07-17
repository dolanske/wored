// This is the element for each input row. Its functionality is to
// collect and validate user inputs and send them to the parent
// form controller

import { cfg } from '../main'
import type { CLS_COLORS } from '../definitions'
import { EVT_BACKSPACE, EVT_ENTER, EVT_LETTER, EVT_ROW_SUBMIT } from '../definitions'
import { isValidInput } from '../validate'

export class ElRow extends HTMLElement {
  input = ''
  isActive = false
  cells: HTMLDivElement[] = []
  #isValidating = false

  constructor() {
    super()
    this.classList.add('row')

    // Generate each input cell
    for (let i = 0; i < cfg.WORD_LENGTH; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      this.cells.push(cell)
      this.appendChild(cell)
    }
  }

  connectedCallback() {
    document.addEventListener(EVT_LETTER, this.__handleLetter.bind(this))
    document.addEventListener(EVT_BACKSPACE, this.__handleBackspace.bind(this))
    document.addEventListener(EVT_ENTER, this.__handleEnter.bind(this))
  }

  __handleLetter(event: Event) {
    if (!this.isActive || !document.contains(this))
      return

    const { char } = (event as CustomEvent<{ char: string }>).detail
    // SECTION: LOGGING
    console.log('Pressed:', `"${char}"`)

    if (this.input.length >= cfg.WORD_LENGTH)
      return

    const index = this.input.length
    this.input += char
    this.cells[index].textContent = char
  }

  __handleBackspace() {
    if (!this.isActive || !document.contains(this))
      return

    // SECTION: LOGGING
    console.log('Pressed Backspace')
    if (this.input.length > 0) {
      const index = this.input.length - 1

      this.input = this.input.substring(0, index)
      this.cells[index].textContent = ''
    }
  }

  __handleEnter(event: Event) {
    if (!this.isActive || !document.contains(this))
      return

    event.preventDefault()
    // SECTION: LOGGING
    console.log('Submitted Row')

    // Abort if validation is in progress
    if (this.#isValidating)
      return

    this.#isValidating = true
    // Validate input, is invalid if:
    //    - contains numbers
    //    - contains special character
    //    - is not exactly length === cfg.ATTEMPTS
    //    - word does not exist at all
    if (!isValidInput(this.input) || this.input.length !== cfg.WORD_LENGTH) {
      // this.input = ''
      console.error(`Invalid input: "${this.input}"`)
    }
    else {
      // Input is ok and is being emitted to the parent component
      const emit = new CustomEvent(EVT_ROW_SUBMIT, {
        bubbles: false,
        detail: { input: this.input },
      })

      this.dispatchEvent(emit)
    }

    this.#isValidating = false
  }

  disconnectedCallback() {
    this.replaceChildren()
    this.isActive = false
    this.cells = []

    // Remove all listeners when element is removed from screen
    document.removeEventListener(EVT_LETTER, this.__handleLetter.bind(this))
    document.removeEventListener(EVT_BACKSPACE, this.__handleBackspace.bind(this))
    document.removeEventListener(EVT_ENTER, this.__handleEnter.bind(this))
  }

  setInputStatusAtIndex(index: number, color: keyof typeof CLS_COLORS) {
    this.cells[index].classList.add(color)
  }
}
