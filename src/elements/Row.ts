// This is the element for each input row. Its functionality is to
// collect and validate user inputs and send them to the parent
// form controller

import { cfg } from '../main'
import { EVT_ROW_SUBMIT } from '../shared'
import { replaceAt } from '../util'
import { isValidEnglishWord, isValidInput } from '../validate'

export class ElRow extends HTMLFormElement {
  input = ''
  isActive = false
  cells: HTMLInputElement[] = []
  #isValidating = false

  constructor() {
    super()

    // Generate each input cell
    for (let i = 0; i < cfg.WORD_LENGTH; i++) {
      const cell = document.createElement('input')
      cell.setAttribute('maxlength', '1')
      cell.setAttribute('type', 'text')
      this.cells.push(cell)
    }

    // Append everything to the element root
    this.append(...this.cells)
    // this.disable()
  }

  connectedCallback() {
    this.addEventListener('submit', async (event) => {
      event.preventDefault()
      console.log('submitted')

      // Abort if validation is in progress
      if (this.#isValidating)
        return

      this.#isValidating = true
      // Validate input, is invalid if:
      //    - contains numbers
      //    - contains special character
      //    - is not exactly length === cfg.ATTEMPTS
      //    - word does not exist at all
      if (!isValidInput(this.input) || !(await isValidEnglishWord(this.input))) {
        this.input = ''
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
    })
  }

  enable() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]
      cell.style.removeProperty('pointer-events')
      cell.removeAttribute('disabled')
      cell.removeEventListener('input', (e) => {
        this.__cellInputHandler(e, i, cell)
      })
    }
  }

  disable() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]
      cell.style.pointerEvents = 'none'
      cell.setAttribute('disabled', 'true')
      cell.removeEventListener('input', (e) => {
        this.__cellInputHandler(e, i, cell)
      })
    }
  }

  // Used for tracking user inputs
  __cellInputHandler(event: Event, index: number, input: HTMLInputElement) {
    event.preventDefault()
    event.stopPropagation()
    replaceAt(this.input, index, input.value.toLowerCase())
  }

  setInputStatusAtIndex(index: number, color: keyof typeof cfg.COLORS) {
    this.cells[index].style.backgroundColor = color
  }
}
