import { ElController } from './elements/controller'
import { ElKeyboard } from './elements/Keyboard'
import { ElRow } from './elements/Row'
import { EL_CONTROLLER, EL_KEYBOARD, EL_ROW } from './shared'

export function register() {
  customElements.define(EL_ROW, ElRow, { extends: 'form' })
  customElements.define(EL_CONTROLLER, ElController)
  customElements.define(EL_KEYBOARD, ElKeyboard)
}
