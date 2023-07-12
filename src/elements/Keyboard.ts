// $ is 'Enter' key
// # is 'Backspace' key
const buttons = 'qwertyuiopasdfghjkl$zxcvbnm#'

export class ElKeyboard extends HTMLElement {
  buttons: HTMLButtonElement[]

  constructor() {
    super()

    // Generate keyboard keys
    this.buttons = buttons.split('').map((char) => {
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

  __letterHandler(char: string) {
    // Send this to Row
    console.log(char)
  }

  __enterHandler() {
    // Submit the current row
  }

  __backspaceHandler() {
    // If current active index has a letter, remove it

    // Move active index 1 back
  }
}
