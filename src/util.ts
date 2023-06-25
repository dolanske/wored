// Checks wether two dates match down to a day, ignores hours, minutes etc
export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate()
    && d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
}

export function replaceAt(str: string, index: number, chr: any) {
  if (index > str.length - 1)
    return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}
