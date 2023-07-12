# WORED (wordle clone)

I was inspired by [Jessica's](https://github.com/jvlazar) wordle replica project, so I decided to implement one myself.
The only reference I had was the fact that I've played wordle before.

## Implementation

TBA

## TODO

- [ ] Dropdown to the right of the title for game configuration
  - [ ] Specify amount of attempts
  - [ ] Specify the length of the word
  - [ ] Allows to reset the game's cached results
  - [ ] Allows restarting the game

- [ ] Cache all results (if won or lost) for the rest of the day
- [ ] Create a history object, which at the end of the game also saves the game object to a separate local storage item
  - [ ] Both of these will require the components to be able to load outside state during initialization

- [ ] Make sure it works on mobile
