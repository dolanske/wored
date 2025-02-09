import { cfg } from './main'

export async function isValidEnglishWord(word: string): Promise<boolean> {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(r => r.json())
    .then((res: any) => res?.title !== 'No Definitions Found')
    .catch(() => false)
}

export function isValidInput(input: string) {
  const rgxSpecialChar = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
  const rgxNumber = /\d/

  return !rgxSpecialChar.test(input)
    && !rgxNumber.test(input)
    && input.length === cfg.WORD_LENGTH
}
