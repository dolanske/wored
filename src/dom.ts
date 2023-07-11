// This file contains any interactions and rendering of dom elements

import { cfg } from './main'
import { replaceAt } from './util'
import { isValidEnglishWord, isValidInput } from './validate'
import { EVT_ROW_SUBMIT, EVT_ROW_SUBMIT_TO_CORE } from './shared'
import type { Letter } from './types'

// This is the element for each input row. Its functionality is to
// collect and validate user inputs and send them to the parent
// form controller

export class ElRow extends HTMLFormElement {
  input = ''
  isActive = false
  cells: HTMLInputElement[] = []
  #isValidating = false

  constructor() {
    super()
    // this.attachShadow({ mode: 'open' })
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
      const cell = document.createElement('input')
      cell.setAttribute('type', 'text')
      this.cells.push(cell)
    }

    // Append everything to the element root
    this.append(...this.cells)
  }

  // TODO This should probably be handled in the controller
  enable() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]

      cell.removeEventListener('input', (e) => {
        this.__cellInputHandler(e, i, cell)
      })
    }
  }

  // TODO: same as above
  disable() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]
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

// The main element which handles all the logic for
// 1. Generating rows
// 2. Listening to row events and forwarding them to the game's core

export class ElController extends HTMLElement {
  activeRowIndex: number
  rows: ElRow[]

  constructor() {
    super()
    this.activeRowIndex = 0
    // this.attachShadow({ mode: 'open' })
    this.rows = []

    // Generate row items
    for (let i = 0; i < cfg.AVAILABLE_ATTEMPTS; i++) {
      const el = new ElRow()
      this.rows.push(el)
      this.appendChild(el)
    }

    this.updateListeners()
  }

  updateListeners() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[0]

      if (i === this.activeRowIndex) {
        // REVIEW
        // In the ideal word, any methods defiend on custom elements should be present in their DOM object
        // Check that out when I am working on the FE
        row.enable()
        row.addEventListener(EVT_ROW_SUBMIT, this.__rowSubmitHandler)
      }
      else {
        row.disable()
        row.removeEventListener(EVT_ROW_SUBMIT, this.__rowSubmitHandler)
      }
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

  endOfRound(roundResult: Letter[]) {
    const currentIndex = this.activeRowIndex
    this.activeRowIndex++
    this.updateListeners()

    const row = this.rows[currentIndex]

    for (let i = 0; i < row.cells.length; i++) {
      const result = roundResult[i]
      const color = (result.isPresent
        ? result.isExactMatch
          ? cfg.COLORS.GREEN
          : cfg.COLORS.ORANGE
        : cfg.COLORS.GRAY) as keyof typeof cfg.COLORS

      row.setInputStatusAtIndex(i, color)
    }
  }
}

// TODO
// Status bar. Receives events from both the controller and input rows.
// Meant to display error / info messages to the users

// interface Toast {
//   type: 'success' | 'error' | 'info'
//   message: string
// }
// class ElStatusBar extends HTMLDivElement {
//   items: Set<Toast> = new Set()
//   constructor() {
//     super()
//   }

//   add(item: Toast) {
//     // this.items.unshift(item)
//     this.add
//     this.update()
//   }

//   clear() {
//     this.items = new Set()
//     this.update()
//   }

//   // Updates the elements
//   update() {

//   }

// }

// customElements.define(EL_STATUS_BAR, ElStatusBar)
