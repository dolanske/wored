// This file contains any interactions and rendering of dom elements

import { cfg } from './main'
import { replaceAt } from './util'
import { isValidEnglishWord, isValidInput } from './validate'
import { COMPONENT_ROW_SUBMIT_ID, GAME_ROW_SUBMIT_ID } from './shared'

customElements.define(
  'row-form',
  class extends HTMLFormElement {
    input: string
    isActive: boolean
    inputs: HTMLInputElement[] = []
    #isValidating: boolean

    constructor() {
      super()
      this.input = ''
      this.isActive = false
      this.attachShadow({ mode: 'open' })

      this.#isValidating = false
      this.addEventListener('submit', async () => {
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
          const emit = new CustomEvent(COMPONENT_ROW_SUBMIT_ID, {
            bubbles: false,
            detail: { input: this.input },
          })

          this.dispatchEvent(emit)
        }
      })

      // Generate each input cell
      for (let i = 0; i < cfg.WORD_LENGTH; i++) {
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        this.inputs.push(input)
      }

      // Append everything to the element root
      this.shadowRoot?.append(...this.inputs)
    }

    // Enables
    enable() {
      for (let i = 0; i < this.inputs.length; i++) {
        const input = this.inputs[i]

        input.removeEventListener('input', (e) => {
          this.__cellInputHandler(e, i, input)
        })
      }
    }

    disable() {
      for (let i = 0; i < this.inputs.length; i++) {
        const input = this.inputs[i]
        input.removeEventListener('input', (e) => {
          this.__cellInputHandler(e, i, input)
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
      this.inputs[index].style.backgroundColor = color
    }
  },
)

// The main element which handles all the logic for
// 1. Generating the inputs
//
customElements.define(
  'form-controller',
  class extends HTMLDivElement {
    activeRowIndex: number
    rows: HTMLFormElement[]

    constructor() {
      super()
      this.activeRowIndex = 0
      this.attachShadow({ mode: 'open' })
      this.rows = []

      // Generate row items
      for (let i = 0; i < cfg.AVAILABLE_ATTEMPTS; i++) {
        if (this.shadowRoot) {
          const el = document.createElement('row-form') as HTMLFormElement
          this.rows.push(el)
          this.shadowRoot?.appendChild(el)
        }
      }

      this.updateListeners()
    }

    updateListeners() {
      for (let i = 0; i < this.rows.length; i++) {
        const row = this.rows[0]

        if (i === this.activeRowIndex)
          row.addEventListener(COMPONENT_ROW_SUBMIT_ID, this.__rowSubmitHandler)
        else
          row.removeEventListener(COMPONENT_ROW_SUBMIT_ID, this.__rowSubmitHandler)
      }
    }

    __rowSubmitHandler(event: Event) {
      // Received a valid input
      const { input } = (event as CustomEvent<{ input: string }>).detail

      const emit = new CustomEvent(GAME_ROW_SUBMIT_ID, {
        bubbles: false,
        detail: { input },
      })

      this.dispatchEvent(emit)
    }

    clearRows() {
      if (this.shadowRoot)
        this.shadowRoot.innerHTML = ''
    }
  },
)
