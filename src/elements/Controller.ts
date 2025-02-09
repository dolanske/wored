// The main element which handles all the logic for
// 1. Generating rows
// 2. Listening to row events and forwarding them to the game's core

import type { Letter } from '../types'
import { CLS_COLORS, CLS_LOSING_ROW, CLS_WINNING_ROW, EVT_ROW_SUBMIT, EVT_ROW_SUBMIT_TO_CORE } from '../definitions'
import { cfg } from '../main'
import { getColorFromResult } from '../util'
import { ElRow } from './Row'

export class ElController extends HTMLElement {
  activeRowIndex: number
  rows: ElRow[]

  constructor() {
    super()
    this.activeRowIndex = 0
    this.rows = []

    // Generate row items
    for (let i = 0; i < cfg.MAX_ATTEMPTS; i++) {
      const el = new ElRow()
      this.rows.push(el)
      this.appendChild(el)
    }
  }

  connectedCallback() {
    this.updateListeners()
  }

  updateListeners() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i]

      if (i === this.activeRowIndex) {
        row.addEventListener(EVT_ROW_SUBMIT, this.__rowSubmitHandler)
        row.isActive = true
      }
      else {
        row.isActive = false
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
      bubbles: true,
      detail: { input },
      composed: true,
    })

    this.dispatchEvent(emit)
  }

  endOfRound(roundResult: Letter[]) {
    const currentIndex = this.activeRowIndex
    const row = this.rows[currentIndex]
    this.activeRowIndex++

    // Will be true if all current cells are green
    // Appends a class to the row
    let winningRow = true

    for (let i = 0; i < row.cells.length; i++) {
      const result = roundResult[i]
      const color = getColorFromResult(result)
      row.setInputStatusAtIndex(i, color)

      if (color !== CLS_COLORS.green)
        winningRow = false
    }

    if (winningRow)
      row.classList.add(CLS_WINNING_ROW)
    else if ((currentIndex + 1) === cfg.MAX_ATTEMPTS)
      row.classList.add(CLS_LOSING_ROW)

    this.updateListeners()
  }
}
