var q = Object.defineProperty;
var z = (s, t, e) => t in s ? q(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var m = (s, t, e) => (z(s, typeof t != "symbol" ? t + "" : t, e), e), D = (s, t, e) => {
  if (!t.has(s))
    throw TypeError("Cannot " + e);
};
var k = (s, t, e) => (D(s, t, "read from private field"), e ? e.call(s) : t.get(s)), G = (s, t, e) => {
  if (t.has(s))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(s) : t.set(s, e);
}, S = (s, t, e, n) => (D(s, t, "write to private field"), n ? n.call(s, e) : t.set(s, e), e);
const T = "wored:row", x = "wored:letter", C = "wored:enter", O = "wored:backspace", V = "wored:core:row", j = "wored:core:reload", N = "wored-row", y = "wored-controller", M = "wored-keyboard", W = "wored-settings-dropdown", b = "wored:word", P = "wored:history", _ = "wored:game", X = "wored-winning-row", J = "wored-losing-row", Z = "wored-game-scope", v = {
  orange: "color-orange",
  green: "color-green",
  gray: "color-gray"
};
function Y(s, t) {
  return s.getDate() === t.getDate() && s.getFullYear() === t.getFullYear() && s.getMonth() === t.getMonth();
}
function I(s) {
  return s.isExactMatch ? v.green : s.isPresent ? v.orange : v.gray;
}
function Q(s, t) {
  return (s.match(new RegExp(t, "g")) || []).length;
}
async function ee(s) {
  return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${s}`).then((t) => t.json()).then((t) => (t == null ? void 0 : t.title) !== "No Definitions Found").catch(() => !1);
}
function te(s) {
  const t = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, e = /\d/;
  return !t.test(s) && !e.test(s) && s.length === a.WORD_LENGTH;
}
var w;
class F extends HTMLElement {
  constructor() {
    super();
    m(this, "input", "");
    m(this, "isActive", !1);
    m(this, "cells", []);
    G(this, w, !1);
    this.classList.add("row");
    for (let e = 0; e < a.WORD_LENGTH; e++) {
      const n = document.createElement("div");
      n.classList.add("cell"), this.cells.push(n), this.appendChild(n);
    }
  }
  connectedCallback() {
    document.addEventListener(x, this.__handleLetter.bind(this)), document.addEventListener(O, this.__handleBackspace.bind(this)), document.addEventListener(C, this.__handleEnter.bind(this));
  }
  __handleLetter(e) {
    if (!this.isActive || !document.contains(this))
      return;
    const { char: n } = e.detail;
    if (console.log("Pressed:", `"${n}"`), this.input.length >= a.WORD_LENGTH)
      return;
    const o = this.input.length;
    this.input += n, this.cells[o].textContent = n;
  }
  __handleBackspace() {
    if (!(!this.isActive || !document.contains(this)) && (console.log("Pressed Backspace"), this.input.length > 0)) {
      const e = this.input.length - 1;
      this.input = this.input.substring(0, e), this.cells[e].textContent = "";
    }
  }
  async __handleEnter(e) {
    if (!(!this.isActive || !document.contains(this)) && (e.preventDefault(), console.log("Submitted Row"), !k(this, w))) {
      if (S(this, w, !0), !te(this.input) || this.input.length !== a.WORD_LENGTH || !await ee(this.input))
        console.error(`Invalid input: "${this.input}"`);
      else {
        const n = new CustomEvent(T, {
          bubbles: !1,
          detail: { input: this.input }
        });
        this.dispatchEvent(n);
      }
      S(this, w, !1);
    }
  }
  disconnectedCallback() {
    this.replaceChildren(), this.isActive = !1, this.cells = [], document.removeEventListener(x, this.__handleLetter.bind(this)), document.removeEventListener(O, this.__handleBackspace.bind(this)), document.removeEventListener(C, this.__handleEnter.bind(this));
  }
  setInputStatusAtIndex(e, n) {
    this.cells[e].classList.add(n);
  }
}
w = new WeakMap();
class H extends HTMLElement {
  constructor() {
    super();
    m(this, "activeRowIndex");
    m(this, "rows");
    this.activeRowIndex = 0, this.rows = [];
    for (let e = 0; e < a.MAX_ATTEMPTS; e++) {
      const n = new F();
      this.rows.push(n), this.appendChild(n);
    }
  }
  connectedCallback() {
    this.updateListeners();
  }
  updateListeners() {
    for (let e = 0; e < this.rows.length; e++) {
      const n = this.rows[e];
      e === this.activeRowIndex ? (n.addEventListener(T, this.__rowSubmitHandler), n.isActive = !0) : (n.isActive = !1, n.removeEventListener(T, this.__rowSubmitHandler));
    }
  }
  __rowSubmitHandler(e) {
    const { input: n } = e.detail, o = new CustomEvent(V, {
      bubbles: !0,
      detail: { input: n },
      composed: !0
    });
    this.dispatchEvent(o);
  }
  endOfRound(e) {
    const n = this.activeRowIndex, o = this.rows[n];
    this.activeRowIndex++;
    let d = !0;
    for (let i = 0; i < o.cells.length; i++) {
      const E = e[i], c = I(E);
      o.setInputStatusAtIndex(i, c), c !== v.green && (d = !1);
    }
    d ? o.classList.add(X) : n + 1 === a.MAX_ATTEMPTS && o.classList.add(J), this.updateListeners();
  }
}
const R = "qwertyuiopasdfghjkl$zxcvbnm#";
class A extends HTMLElement {
  constructor() {
    super();
    m(this, "buttons");
    this.buttons = R.split("").map((e) => {
      const n = document.createElement("button");
      return e === "$" ? (n.textContent = "ENTER", n.addEventListener("click", this.__enterHandler.bind(this))) : e === "#" ? (n.textContent = "DELETE", n.addEventListener("click", this.__backspaceHandler.bind(this))) : (n.textContent = e.toUpperCase(), n.addEventListener("click", () => this.__letterHandler(e))), n;
    }), document.addEventListener("keydown", this.__keyPressHandler.bind(this));
  }
  connectedCallback() {
    this.append(...this.buttons);
  }
  // Iterates over letters and assigns their colors based on the results
  highlightLetters(e) {
    for (const n of e) {
      const o = I(n), d = R.indexOf(n.letterUser);
      this.buttons[d].classList.add(o);
    }
  }
  // Will disable any interaction after game has concluded
  disable() {
    for (const e of this.buttons)
      e.removeEventListener("click", this.__enterHandler), e.removeEventListener("click", this.__backspaceHandler), e.removeEventListener("click", () => this.__letterHandler("")), e.setAttribute("disabled", "true");
    document.removeEventListener("keydown", this.__keyPressHandler);
  }
  // Send the character into the row element
  __letterHandler(e) {
    const n = new CustomEvent(x, {
      detail: { char: e },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(n);
  }
  // Submit the current row
  __enterHandler() {
    const e = new CustomEvent(C, {
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  // If current active index has a letter, remove it
  __backspaceHandler() {
    const e = new CustomEvent(O, {
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  // Allows users to type on their keyboard
  __keyPressHandler(e) {
    if (!r.running)
      return;
    const { key: n } = e;
    R.includes(n) ? this.__letterHandler(n) : n === "Backspace" ? this.__backspaceHandler() : n === "Enter" && this.__enterHandler();
  }
}
const ne = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path></svg>', se = 3, oe = 12, re = 1, ie = 16;
function $(s, t, e, n) {
  const o = document.createElement("select");
  o.addEventListener("input", n);
  const d = document.createElement("label");
  d.textContent = s;
  for (let i = t; i < e; i++) {
    const E = document.createElement("option");
    E.value = `${i}`, E.textContent = `${i}`, o.appendChild(E);
  }
  return {
    label: d,
    select: o
  };
}
class K extends HTMLElement {
  constructor() {
    super();
    m(this, "open", !1);
    m(this, "wrap", document.createElement("div"));
    m(this, "trigger", document.createElement("button"));
    const e = $(
      "Word Length",
      se,
      oe,
      this.__handleWordLengthSelect.bind(this)
    );
    e.select.value = `${a.WORD_LENGTH}`;
    const n = $(
      "Attempts",
      re,
      ie,
      this.__handleAttemptCountSelect.bind(this)
    );
    n.select.value = `${a.MAX_ATTEMPTS}`;
    const o = document.createElement("button");
    o.innerText = "Restart", o.addEventListener("click", this.__handleRestartGame.bind(this));
    const d = document.createElement("button");
    d.innerText = "New Word", d.addEventListener("click", this.__handleRefreshGame.bind(this)), this.wrap.classList.add("drp-wrap"), this.wrap.append(
      n.label,
      n.select,
      e.label,
      e.select,
      d,
      o
    ), this.trigger.innerHTML = ne, this.trigger.classList.add("drp-trigger"), this.trigger.addEventListener("click", this.toggle.bind(this)), this.append(this.trigger, this.wrap);
  }
  toggle() {
    this.open = !this.open, this.wrap.style.display = this.open ? "block" : "none", this.trigger.classList.toggle("active");
  }
  sendReloadEvent() {
    this.dispatchEvent(new CustomEvent(j, {
      composed: !0,
      bubbles: !0
    }));
  }
  // Changed the word length
  __handleWordLengthSelect(e) {
    a.WORD_LENGTH = Number(e.target.value), localStorage.removeItem(_), localStorage.removeItem(b), this.toggle(), this.sendReloadEvent();
  }
  // Changed the amount of attempts
  __handleAttemptCountSelect(e) {
    a.MAX_ATTEMPTS = Number(e.target.value), localStorage.removeItem(_), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game and get an new word
  __handleRefreshGame() {
    localStorage.removeItem(_), localStorage.removeItem(b), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game (but keep the word)
  __handleRestartGame() {
    localStorage.removeItem(_), this.toggle(), this.sendReloadEvent();
  }
}
function le() {
  customElements.get(N) || customElements.define(N, F), customElements.get(y) || customElements.define(y, H), customElements.get(M) || customElements.define(M, A), customElements.get(W) || customElements.define(W, K);
}
function U(s) {
  localStorage.setItem(_, JSON.stringify(s));
}
function ae() {
  const s = localStorage.getItem(_);
  if (!s)
    return null;
  const t = JSON.parse(s);
  return Y(/* @__PURE__ */ new Date(), new Date(t.timestamp)) ? t : (localStorage.removeItem(_), null);
}
function ce(s) {
  const t = localStorage.getItem(P);
  let e;
  t ? (e = JSON.parse(t), e.entries.push(s)) : e = {
    lastWrite: Date.now(),
    entries: [s]
  }, localStorage.setItem(P, JSON.stringify(e));
}
const a = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6
}, r = {
  running: !1,
  word: "",
  rounds: [],
  win: !1,
  timestamps: {
    from: 0,
    to: 0
  }
};
async function B() {
  const s = localStorage.getItem(b);
  if (s) {
    const t = JSON.parse(s), e = /* @__PURE__ */ new Date(), n = new Date(t.timestamp);
    if (Y(e, n) && t.length === a.WORD_LENGTH)
      return Promise.resolve(t.word);
  }
  return fetch(`https://random-word-api.herokuapp.com/word?length=${a.WORD_LENGTH}`).then((t) => t.json()).then(([t]) => (localStorage.setItem(b, JSON.stringify({
    word: t,
    timestamp: Date.now(),
    length: a.WORD_LENGTH
  })), t)).catch((t) => {
    console.error(t);
  });
}
async function he(s) {
  le(), console.clear();
  const t = ae(), e = t ? t.game.word : await B();
  console.log(`---------- New Game: "${e}" ----------`), t ? (Object.assign(r, t.game), Object.assign(r.timestamps, t.game.timestamps), Object.assign(a, t.cfg)) : (r.running = !0, r.word = e, r.timestamps.from = Date.now());
  let n = new H(), o = new A();
  const d = new K(), i = document.querySelector(s);
  if (t && (n.activeRowIndex = t.game.rounds.length), i == null || i.append(n, o, d), i == null || i.classList.add(Z), t) {
    t.game.running || o.disable();
    for (let c = 0; c < t.game.rounds.length; c++) {
      const u = n.rows[c], h = t.game.rounds[c];
      let g = !0;
      u.isActive = !1, u.input = h.userGuess;
      for (let l = 0; l < h.letters.length; l++) {
        const p = h.letters[l], f = u.cells[l];
        f.innerText = p.letterUser;
        const L = I(p);
        u.setInputStatusAtIndex(l, L), L !== v.green && (g = !1);
      }
      g ? u.classList.add(X) : c + 1 === a.MAX_ATTEMPTS && u.classList.add(J), o.highlightLetters(h.letters);
    }
  }
  document.addEventListener(V, (c) => {
    const { input: u } = c.detail, h = {
      index: r.rounds.length,
      userGuess: u,
      letters: []
    };
    for (let l = 0; l < a.WORD_LENGTH; l++) {
      const p = u.charAt(l), f = r.word.charAt(l), L = {
        letterActual: f,
        letterUser: p,
        isPresent: r.word.includes(p),
        isExactMatch: p === f
      };
      h.letters.push(L);
    }
    const g = {};
    for (const l of h.letters)
      if (l.isPresent) {
        if (g[l.letterUser] ? g[l.letterUser]++ : g[l.letterUser] = 1, l.isExactMatch)
          continue;
        const p = Q(r.word, l.letterUser);
        if (g[l.letterUser] <= p)
          continue;
        l.isPresent = !1;
      }
    console.log("Round results"), console.table(h.letters), r.rounds.push(h), n.endOfRound(h.letters), o.highlightLetters(h.letters), E();
  }), document.addEventListener(j, async () => {
    r.word = await B(), r.rounds = [], r.timestamps.from = Date.now(), r.running = !0, console.log(`---------- New Game: "${r.word}" ----------`), n.replaceChildren(), n.remove(), o.replaceChildren(), o.remove(), requestAnimationFrame(() => {
      n = new H(), o = new A(), i == null || i.append(n, o);
    });
  });
  function E() {
    const c = r.rounds.some((h) => h.letters.every((g) => g.isExactMatch));
    if (a.MAX_ATTEMPTS !== r.rounds.length && !c) {
      U({ game: r, cfg: a, timestamp: Date.now() });
      return;
    }
    r.running = !1, r.timestamps.to = Date.now(), o.disable(), c && (r.win = !0, console.log(`[${r.word}] Game over! You won!`)), c || console.log(`[${r.word}] Game over! You lost`);
    const u = { game: r, cfg: a, timestamp: Date.now() };
    U(u), ce(u);
  }
}
export {
  a as cfg,
  r as game,
  he as run
};
