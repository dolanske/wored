import { EL_CONTROLLER, EL_DROPDOWN, EL_KEYBOARD, EL_ROW } from './definitions'
import { ElController } from './elements/Controller'
import { ElDropdown } from './elements/Dropdown'
import { ElKeyboard } from './elements/Keyboard'
import { ElRow } from './elements/Row'

export function register() {
  if (!customElements.get(EL_ROW))
    customElements.define(EL_ROW, ElRow)

  if (!customElements.get(EL_CONTROLLER))
    customElements.define(EL_CONTROLLER, ElController)

  if (!customElements.get(EL_KEYBOARD))
    customElements.define(EL_KEYBOARD, ElKeyboard)

  if (!customElements.get(EL_DROPDOWN))
    customElements.define(EL_DROPDOWN, ElDropdown)
}
