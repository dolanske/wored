// The main element which handles all the logic for
// 1. Generating rows
// 2. Listening to row events and forwarding them to the game's core

import { cfg } from '../main'
import { EVT_ROW_SUBMIT, EVT_ROW_SUBMIT_TO_CORE } from '../shared'
import type { Letter } from '../types'
import { ElRow } from './Row'

export class ElController extends HTMLElement {
  activeRowIndex: number
  rows: ElRow[]

  constructor() {
    super()
    this.activeRowIndex = 0
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
      const row = this.rows[i]

      if (i === this.activeRowIndex) {
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

    console.log('SUBMIT', input)

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
