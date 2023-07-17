# WORED (wordle replica)

Last thing to fix:

- [ ] Scope game's styles into a single CSS class

---

I was inspired by [Jessica's](https://github.com/jvlazar) wordle replica project, so I decided to implement one myself.
The only reference I had was the fact that I've played wordle before.

Unlike wordle, wored offers a few additions to the normal game.

- You can change the amount of attempts. Minimum is 1, maximum 16
- You can change the length of the word. Minimum is 3 letters, maximum is 12

![Example Screenshot](https://i.imgur.com/Vv127V2.png)

---

## Installation

1. Simply clone the repo by using.

    ```bash
    npm i -S git+https://github.com/dolanske/wored.git
    ```

2. Run the game by supplying it with an elemet to mount to (using `document.querySelector()`)

    ```ts
    import { run } from '@dolanske/wored'

    // Expects that your dom contains a <div id="#game">
    run('#game')
    ```

3. Optionally, you can modify the game's default config. Just make sure to make any changes before actually running the game.

    ```ts
    import { cfg, run } from '@dolanske/wored'

    cfg.WORD_LENGTH = 10
    cfg.MAX_ATTEMPTS = 3

    run('#game')
    ```
