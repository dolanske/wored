import { CLS_COLORS } from './definitions'
import type { Letter } from './types'

// Checks wether two dates match down to a day, ignores hours, minutes etc
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate()
    && d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
}

// Replaces a character in a string at the given index
export function replaceAt(str: string, index: number, chr: any) {
  if (index > str.length - 1)
    return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

export function getColorFromResult(round: Letter) {
  return (round.isPresent
    ? round.isExactMatch
      ? CLS_COLORS.green
      : CLS_COLORS.orange
    : CLS_COLORS.gray)
}
