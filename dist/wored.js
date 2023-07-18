var K = Object.defineProperty;
var q = (s, t, e) => t in s ? K(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var u = (s, t, e) => (q(s, typeof t != "symbol" ? t + "" : t, e), e), D = (s, t, e) => {
  if (!t.has(s))
    throw TypeError("Cannot " + e);
};
var I = (s, t, e) => (D(s, t, "read from private field"), e ? e.call(s) : t.get(s)), G = (s, t, e) => {
  if (t.has(s))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(s) : t.set(s, e);
}, R = (s, t, e, n) => (D(s, t, "write to private field"), n ? n.call(s, e) : t.set(s, e), e);
const T = "wored:row", C = "wored:letter", O = "wored:enter", x = "wored:backspace", j = "wored:core:row", J = "wored:core:reload", N = "wored-row", y = "wored-controller", M = "wored-keyboard", W = "wored-settings-dropdown", b = "wored:word", P = "wored:history", E = "wored:game", U = "wored-winning-row", z = "wored-game-scope", v = {
  orange: "color-orange",
  green: "color-green",
  gray: "color-gray"
};
function Y(s, t) {
  return s.getDate() === t.getDate() && s.getFullYear() === t.getFullYear() && s.getMonth() === t.getMonth();
}
function A(s) {
  return s.isPresent ? s.isExactMatch ? v.green : v.orange : v.gray;
}
function Z(s) {
  const t = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, e = /\d/;
  return !t.test(s) && !e.test(s) && s.length === l.WORD_LENGTH;
}
var _;
class X extends HTMLElement {
  constructor() {
    super();
    u(this, "input", "");
    u(this, "isActive", !1);
    u(this, "cells", []);
    G(this, _, !1);
    this.classList.add("row");
    for (let e = 0; e < l.WORD_LENGTH; e++) {
      const n = document.createElement("div");
      n.classList.add("cell"), this.cells.push(n), this.appendChild(n);
    }
  }
  connectedCallback() {
    document.addEventListener(C, this.__handleLetter.bind(this)), document.addEventListener(x, this.__handleBackspace.bind(this)), document.addEventListener(O, this.__handleEnter.bind(this));
  }
  __handleLetter(e) {
    if (!this.isActive || !document.contains(this))
      return;
    const { char: n } = e.detail;
    if (console.log("Pressed:", `"${n}"`), this.input.length >= l.WORD_LENGTH)
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
  __handleEnter(e) {
    if (!(!this.isActive || !document.contains(this)) && (e.preventDefault(), console.log("Submitted Row"), !I(this, _))) {
      if (R(this, _, !0), !Z(this.input) || this.input.length !== l.WORD_LENGTH)
        console.error(`Invalid input: "${this.input}"`);
      else {
        const n = new CustomEvent(T, {
          bubbles: !1,
          detail: { input: this.input }
        });
        this.dispatchEvent(n);
      }
      R(this, _, !1);
    }
  }
  disconnectedCallback() {
    this.replaceChildren(), this.isActive = !1, this.cells = [], document.removeEventListener(C, this.__handleLetter.bind(this)), document.removeEventListener(x, this.__handleBackspace.bind(this)), document.removeEventListener(O, this.__handleEnter.bind(this));
  }
  setInputStatusAtIndex(e, n) {
    this.cells[e].classList.add(n);
  }
}
_ = new WeakMap();
class H extends HTMLElement {
  constructor() {
    super();
    u(this, "activeRowIndex");
    u(this, "rows");
    this.activeRowIndex = 0, this.rows = [];
    for (let e = 0; e < l.MAX_ATTEMPTS; e++) {
      const n = new X();
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
    const { input: n } = e.detail, o = new CustomEvent(j, {
      bubbles: !0,
      detail: { input: n },
      composed: !0
    });
    this.dispatchEvent(o);
  }
  endOfRound(e) {
    const n = this.activeRowIndex, o = this.rows[n];
    this.activeRowIndex++;
    let a = !0;
    for (let i = 0; i < o.cells.length; i++) {
      const p = e[i], c = A(p);
      o.setInputStatusAtIndex(i, c), c !== v.green && (a = !1);
    }
    a && o.classList.add(U), this.updateListeners();
  }
}
const S = "qwertyuiopasdfghjkl$zxcvbnm#";
class k extends HTMLElement {
  constructor() {
    super();
    u(this, "buttons");
    this.buttons = S.split("").map((e) => {
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
      const o = A(n), a = S.indexOf(n.letterUser);
      this.buttons[a].classList.add(o);
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
    const n = new CustomEvent(C, {
      detail: { char: e },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(n);
  }
  // Submit the current row
  __enterHandler() {
    const e = new CustomEvent(O, {
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  // If current active index has a letter, remove it
  __backspaceHandler() {
    const e = new CustomEvent(x, {
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
    S.includes(n) ? this.__letterHandler(n) : n === "Backspace" ? this.__backspaceHandler() : n === "Enter" && this.__enterHandler();
  }
}
const Q = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path></svg>', ee = 3, te = 12, ne = 1, se = 16;
function $(s, t, e, n) {
  const o = document.createElement("select");
  o.addEventListener("input", n);
  const a = document.createElement("label");
  a.textContent = s;
  for (let i = t; i < e; i++) {
    const p = document.createElement("option");
    p.value = `${i}`, p.textContent = `${i}`, o.appendChild(p);
  }
  return {
    label: a,
    select: o
  };
}
class F extends HTMLElement {
  constructor() {
    super();
    u(this, "open", !1);
    u(this, "wrap", document.createElement("div"));
    u(this, "trigger", document.createElement("button"));
    const e = $(
      "Word Length",
      ee,
      te,
      this.__handleWordLengthSelect.bind(this)
    );
    e.select.value = `${l.WORD_LENGTH}`;
    const n = $(
      "Attempts",
      ne,
      se,
      this.__handleAttemptCountSelect.bind(this)
    );
    n.select.value = `${l.MAX_ATTEMPTS}`;
    const o = document.createElement("button");
    o.innerText = "Restart", o.addEventListener("click", this.__handleRestartGame.bind(this));
    const a = document.createElement("button");
    a.innerText = "New Word", a.addEventListener("click", this.__handleRefreshGame.bind(this)), this.wrap.classList.add("drp-wrap"), this.wrap.append(
      n.label,
      n.select,
      e.label,
      e.select,
      a,
      o
    ), this.trigger.innerHTML = Q, this.trigger.classList.add("drp-trigger"), this.trigger.addEventListener("click", this.toggle.bind(this)), this.append(this.trigger, this.wrap);
  }
  toggle() {
    this.open = !this.open, this.wrap.style.display = this.open ? "block" : "none", this.trigger.classList.toggle("active");
  }
  sendReloadEvent() {
    this.dispatchEvent(new CustomEvent(J, {
      composed: !0,
      bubbles: !0
    }));
  }
  // Changed the word length
  __handleWordLengthSelect(e) {
    l.WORD_LENGTH = Number(e.target.value), localStorage.removeItem(E), localStorage.removeItem(b), this.toggle(), this.sendReloadEvent();
  }
  // Changed the amount of attempts
  __handleAttemptCountSelect(e) {
    l.MAX_ATTEMPTS = Number(e.target.value), localStorage.removeItem(E), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game and get an new word
  __handleRefreshGame() {
    localStorage.removeItem(E), localStorage.removeItem(b), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game (but keep the word)
  __handleRestartGame() {
    localStorage.removeItem(E), this.toggle(), this.sendReloadEvent();
  }
}
function oe() {
  customElements.get(N) || customElements.define(N, X), customElements.get(y) || customElements.define(y, H), customElements.get(M) || customElements.define(M, k), customElements.get(W) || customElements.define(W, F);
}
function B(s) {
  localStorage.setItem(E, JSON.stringify(s));
}
function re() {
  const s = localStorage.getItem(E);
  if (!s)
    return null;
  const t = JSON.parse(s);
  return Y(/* @__PURE__ */ new Date(), new Date(t.timestamp)) ? t : (localStorage.removeItem(E), null);
}
function ie(s) {
  const t = localStorage.getItem(P);
  let e;
  t ? (e = JSON.parse(t), e.entries.push(s)) : e = {
    lastWrite: Date.now(),
    entries: [s]
  }, localStorage.setItem(P, JSON.stringify(e));
}
const l = {
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
async function V() {
  const s = localStorage.getItem(b);
  if (s) {
    const t = JSON.parse(s), e = /* @__PURE__ */ new Date(), n = new Date(t.timestamp);
    if (Y(e, n) && t.length === l.WORD_LENGTH)
      return Promise.resolve(t.word);
  }
  return fetch(`https://random-word-api.herokuapp.com/word?length=${l.WORD_LENGTH}`).then((t) => t.json()).then(([t]) => (localStorage.setItem(b, JSON.stringify({
    word: t,
    timestamp: Date.now(),
    length: l.WORD_LENGTH
  })), t)).catch((t) => {
    console.error(t);
  });
}
async function ae(s) {
  oe(), console.clear();
  const t = re(), e = t ? t.game.word : await V();
  console.log(`---------- New Game: "${e}" ----------`), t ? (Object.assign(r, t.game), Object.assign(r.timestamps, t.game.timestamps), Object.assign(l, t.cfg)) : (r.running = !0, r.word = e, r.timestamps.from = Date.now());
  let n = new H(), o = new k();
  const a = new F(), i = document.querySelector(s);
  if (t && (n.activeRowIndex = t.game.rounds.length), i == null || i.append(n, o, a), i == null || i.classList.add(z), t) {
    t.game.running || o.disable();
    for (let c = 0; c < t.game.rounds.length; c++) {
      const h = n.rows[c], d = t.game.rounds[c];
      let m = !0;
      h.isActive = !1, h.input = d.userGuess;
      for (let g = 0; g < d.letters.length; g++) {
        const w = d.letters[g], L = h.cells[g];
        L.innerText = w.letterUser;
        const f = A(w);
        h.setInputStatusAtIndex(g, f), f !== v.green && (m = !1);
      }
      m && h.classList.add(U), o.highlightLetters(d.letters);
    }
  }
  document.addEventListener(j, (c) => {
    const { input: h } = c.detail, d = {
      index: r.rounds.length,
      userGuess: h,
      letters: []
    };
    for (let m = 0; m < l.WORD_LENGTH; m++) {
      const g = h.charAt(m), w = r.word.charAt(m), L = r.word.includes(g), f = {
        letterActual: w,
        letterUser: g,
        isPresent: L,
        isExactMatch: g === w
      };
      d.letters.push(f);
    }
    console.log("Round results"), console.table(d.letters), r.rounds.push(d), n.endOfRound(d.letters), o.highlightLetters(d.letters), p();
  }), document.addEventListener(J, async () => {
    r.word = await V(), r.rounds = [], r.timestamps.from = Date.now(), r.running = !0, console.log(`---------- New Game: "${r.word}" ----------`), n.replaceChildren(), n.remove(), o.replaceChildren(), o.remove(), requestAnimationFrame(() => {
      n = new H(), o = new k(), i == null || i.append(n, o);
    });
  });
  function p() {
    const c = r.rounds.some((d) => d.letters.every((m) => m.isExactMatch));
    if (l.MAX_ATTEMPTS !== r.rounds.length && !c) {
      B({ game: r, cfg: l, timestamp: Date.now() });
      return;
    }
    r.running = !1, r.timestamps.to = Date.now(), o.disable(), c && (r.win = !0, console.log(`[${r.word}] Game over! You won!`)), c || console.log(`[${r.word}] Game over! You lost`);
    const h = { game: r, cfg: l, timestamp: Date.now() };
    B(h), ie(h);
  }
}
export {
  l as cfg,
  r as game,
  ae as run
};
