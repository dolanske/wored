// -----
// List of string IDs which are used multiple times across the project

// This is fired when row component wants to let the form controller know
export const EVT_ROW_SUBMIT = 'wored:row'
export const EVT_LETTER = 'wored:letter'
export const EVT_ENTER = 'wored:enter'
export const EVT_BACKSPACE = 'wored:backspace'

// This is when form controller lets the game core know
export const EVT_ROW_SUBMIT_TO_CORE = 'wored:core:row'
export const EVT_GAME_RELOAD_TO_CORE = 'wored:core:reload'

// Elements
export const EL_ROW = 'wored-row'
export const EL_CONTROLLER = 'wored-controller'
export const EL_KEYBOARD = 'wored-keyboard'
export const EL_DROPDOWN = 'wored-settings-dropdown'

export const CLS_COLORS = {
  orange: 'color-orange',
  green: 'color-green',
  gray: 'color-gray',
}

// Local storage items
export const S_WORD = 'wored:word'
export const S_HISTORY = 'wored:history'
export const S_GAME = 'wored:game'