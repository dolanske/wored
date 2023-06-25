// This file contains any interactions and rendering of dom elements

import { cfg } from './main'
import { replaceAt } from './util'
import { isValidEnglishWord, isValidInput } from './validate'
import { EL_CONTROLLER, EL_ROW, EL_STATUS_BAR, EVT_ROW_SUBMIT, EVT_ROW_SUBMIT_TO_CORE } from './shared'

// This is the element for each input row. Its functionality is to
// collect and validate user inputs and send them to the parent
// form controller
customElements.define(
  EL_ROW,
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
          const emit = new CustomEvent(EVT_ROW_SUBMIT, {
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
// 1. Generating rows
// 2. Listening to row events and forwarding them to the game's core
customElements.define(
  EL_CONTROLLER,
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
          row.addEventListener(EVT_ROW_SUBMIT, this.__rowSubmitHandler)
        else
          row.removeEventListener(EVT_ROW_SUBMIT, this.__rowSubmitHandler)
      }
    }

    __rowSubmitHandler(event: Event) {
      // Received a valid input
      const { input } = (event as CustomEvent<{ input: string }>).detail

      // Note This event could probably go straight from `row > core`
      // instead of `row > controller > core`, but I wanted some wiggle
      // room for extra validation/loggin if needed later
      const emit = new CustomEvent(EVT_ROW_SUBMIT_TO_CORE, {
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

// TODO
// Status bar. Receives events from both the controller and input rows.
// Meant to display error / info messages to the users
customElements.define(
  EL_STATUS_BAR,
  class extends HTMLDivElement { },
)
