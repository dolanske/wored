import { ElController } from './elements/Controller'
import { ElKeyboard } from './elements/Keyboard'
import { ElRow } from './elements/Row'
import { EL_CONTROLLER, EL_DROPDOWN, EL_KEYBOARD, EL_ROW } from './definitions'
import { ElDropdown } from './elements/Dropdown'

export function register() {
  customElements.define(EL_ROW, ElRow)
  customElements.define(EL_CONTROLLER, ElController)
  customElements.define(EL_KEYBOARD, ElKeyboard)
  customElements.define(EL_DROPDOWN, ElDropdown)
}
