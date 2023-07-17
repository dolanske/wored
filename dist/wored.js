var j = Object.defineProperty;
var J = (s, t, e) => t in s ? j(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var u = (s, t, e) => (J(s, typeof t != "symbol" ? t + "" : t, e), e), k = (s, t, e) => {
  if (!t.has(s))
    throw TypeError("Cannot " + e);
};
var I = (s, t, e) => (k(s, t, "read from private field"), e ? e.call(s) : t.get(s)), D = (s, t, e) => {
  if (t.has(s))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(s) : t.set(s, e);
}, b = (s, t, e, n) => (k(s, t, "write to private field"), n ? n.call(s, e) : t.set(s, e), e);
const R = "wored:row", S = "wored:letter", T = "wored:enter", C = "wored:backspace", W = "wored:core:row", P = "wored:core:reload", U = "wored-row", Y = "wored-controller", X = "wored-keyboard", F = "wored-settings-dropdown", w = {
  orange: "color-orange",
  green: "color-green",
  gray: "color-gray"
}, v = "wored:word", G = "wored:history", p = "wored:game", $ = "wored-winning-row";
function B(s, t) {
  return s.getDate() === t.getDate() && s.getFullYear() === t.getFullYear() && s.getMonth() === t.getMonth();
}
function H(s) {
  return s.isPresent ? s.isExactMatch ? w.green : w.orange : w.gray;
}
function K(s) {
  const t = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, e = /\d/;
  return !t.test(s) && !e.test(s) && s.length === l.WORD_LENGTH;
}
var E;
class V extends HTMLElement {
  constructor() {
    super();
    u(this, "input", "");
    u(this, "isActive", !1);
    u(this, "cells", []);
    D(this, E, !1);
    this.classList.add("row");
    for (let e = 0; e < l.WORD_LENGTH; e++) {
      const n = document.createElement("div");
      n.classList.add("cell"), this.cells.push(n), this.appendChild(n);
    }
  }
  connectedCallback() {
    document.addEventListener(S, this.__handleLetter.bind(this)), document.addEventListener(C, this.__handleBackspace.bind(this)), document.addEventListener(T, this.__handleEnter.bind(this));
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
    if (!(!this.isActive || !document.contains(this)) && (e.preventDefault(), console.log("Submitted Row"), !I(this, E))) {
      if (b(this, E, !0), !K(this.input) || this.input.length !== l.WORD_LENGTH)
        console.error(`Invalid input: "${this.input}"`);
      else {
        const n = new CustomEvent(R, {
          bubbles: !1,
          detail: { input: this.input }
        });
        this.dispatchEvent(n);
      }
      b(this, E, !1);
    }
  }
  disconnectedCallback() {
    this.replaceChildren(), this.isActive = !1, this.cells = [], document.removeEventListener(S, this.__handleLetter.bind(this)), document.removeEventListener(C, this.__handleBackspace.bind(this)), document.removeEventListener(T, this.__handleEnter.bind(this));
  }
  setInputStatusAtIndex(e, n) {
    this.cells[e].classList.add(n);
  }
}
E = new WeakMap();
class O extends HTMLElement {
  constructor() {
    super();
    u(this, "activeRowIndex");
    u(this, "rows");
    this.activeRowIndex = 0, this.rows = [];
    for (let e = 0; e < l.MAX_ATTEMPTS; e++) {
      const n = new V();
      this.rows.push(n), this.appendChild(n);
    }
  }
  connectedCallback() {
    this.updateListeners();
  }
  updateListeners() {
    for (let e = 0; e < this.rows.length; e++) {
      const n = this.rows[e];
      e === this.activeRowIndex ? (n.addEventListener(R, this.__rowSubmitHandler), n.isActive = !0) : (n.isActive = !1, n.removeEventListener(R, this.__rowSubmitHandler));
    }
  }
  __rowSubmitHandler(e) {
    const { input: n } = e.detail, o = new CustomEvent(W, {
      bubbles: !0,
      detail: { input: n },
      composed: !0
    });
    this.dispatchEvent(o);
  }
  endOfRound(e) {
    const n = this.activeRowIndex, o = this.rows[n];
    this.activeRowIndex++;
    let i = !0;
    for (let h = 0; h < o.cells.length; h++) {
      const a = e[h], c = H(a);
      o.setInputStatusAtIndex(h, c), c !== w.green && (i = !1);
    }
    i && o.classList.add($), this.updateListeners();
  }
}
const L = "qwertyuiopasdfghjkl$zxcvbnm#";
class x extends HTMLElement {
  constructor() {
    super();
    u(this, "buttons");
    this.buttons = L.split("").map((e) => {
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
      const o = H(n), i = L.indexOf(n.letterUser);
      this.buttons[i].classList.add(o);
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
    const n = new CustomEvent(S, {
      detail: { char: e },
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(n);
  }
  // Submit the current row
  __enterHandler() {
    const e = new CustomEvent(T, {
      bubbles: !0,
      composed: !0
    });
    this.dispatchEvent(e);
  }
  // If current active index has a letter, remove it
  __backspaceHandler() {
    const e = new CustomEvent(C, {
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
    L.includes(n) ? this.__letterHandler(n) : n === "Backspace" ? this.__backspaceHandler() : n === "Enter" && this.__enterHandler();
  }
}
const q = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path></svg>', z = 3, Z = 12, Q = 1, ee = 16;
function N(s, t, e, n) {
  const o = document.createElement("select");
  o.addEventListener("input", n);
  const i = document.createElement("label");
  i.textContent = s;
  for (let h = t; h < e; h++) {
    const a = document.createElement("option");
    a.value = `${h}`, a.textContent = `${h}`, o.appendChild(a);
  }
  return {
    label: i,
    select: o
  };
}
class te extends HTMLElement {
  constructor() {
    super();
    u(this, "open", !1);
    u(this, "wrap", document.createElement("div"));
    u(this, "trigger", document.createElement("button"));
    const e = N(
      "Word Length",
      z,
      Z,
      this.__handleWordLengthSelect.bind(this)
    );
    e.select.value = `${l.WORD_LENGTH}`;
    const n = N(
      "Attempts",
      Q,
      ee,
      this.__handleAttemptCountSelect.bind(this)
    );
    n.select.value = `${l.MAX_ATTEMPTS}`;
    const o = document.createElement("button");
    o.innerText = "Restart", o.addEventListener("click", this.__handleRestartGame.bind(this));
    const i = document.createElement("button");
    i.innerText = "New Word", i.addEventListener("click", this.__handleRefreshGame.bind(this)), this.wrap.classList.add("drp-wrap"), this.wrap.append(
      n.label,
      n.select,
      e.label,
      e.select,
      i,
      o
    ), this.trigger.innerHTML = q, this.trigger.classList.add("drp-trigger"), this.trigger.addEventListener("click", this.toggle.bind(this)), this.append(this.trigger, this.wrap);
  }
  toggle() {
    this.open = !this.open, this.wrap.style.display = this.open ? "block" : "none", this.trigger.classList.toggle("active");
  }
  sendReloadEvent() {
    this.dispatchEvent(new CustomEvent(P, {
      composed: !0,
      bubbles: !0
    }));
  }
  // Changed the word length
  __handleWordLengthSelect(e) {
    l.WORD_LENGTH = Number(e.target.value), localStorage.removeItem(p), localStorage.removeItem(v), this.toggle(), this.sendReloadEvent();
  }
  // Changed the amount of attempts
  __handleAttemptCountSelect(e) {
    l.MAX_ATTEMPTS = Number(e.target.value), localStorage.removeItem(p), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game and get an new word
  __handleRefreshGame() {
    localStorage.removeItem(p), localStorage.removeItem(v), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game (but keep the word)
  __handleRestartGame() {
    localStorage.removeItem(p), this.toggle(), this.sendReloadEvent();
  }
}
function ne() {
  customElements.define(U, V), customElements.define(Y, O), customElements.define(X, x), customElements.define(F, te);
}
function y(s) {
  localStorage.setItem(p, JSON.stringify(s));
}
function se() {
  const s = localStorage.getItem(p);
  if (!s)
    return null;
  const t = JSON.parse(s);
  return B(/* @__PURE__ */ new Date(), new Date(t.timestamp)) ? t : (localStorage.removeItem(p), null);
}
function oe(s) {
  const t = localStorage.getItem(G);
  let e;
  t ? (e = JSON.parse(t), e.entries.push(s)) : e = {
    lastWrite: Date.now(),
    entries: [s]
  }, localStorage.setItem(G, JSON.stringify(e));
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
async function M() {
  const s = localStorage.getItem(v);
  if (s) {
    const t = JSON.parse(s), e = /* @__PURE__ */ new Date(), n = new Date(t.timestamp);
    if (B(e, n) && t.length === l.WORD_LENGTH)
      return Promise.resolve(t.word);
  }
  return fetch(`https://random-word-api.herokuapp.com/word?length=${l.WORD_LENGTH}`).then((t) => t.json()).then(([t]) => (localStorage.setItem(v, JSON.stringify({
    word: t,
    timestamp: Date.now(),
    length: l.WORD_LENGTH
  })), t)).catch((t) => {
    console.error(t);
  });
}
async function re(s) {
  ne(), console.clear();
  const t = se(), e = t ? t.game.word : await M();
  console.log(`---------- New Game: "${e}" ----------`), t ? (Object.assign(r, t.game), Object.assign(r.timestamps, t.game.timestamps), Object.assign(l, t.cfg)) : (r.running = !0, r.word = e, r.timestamps.from = Date.now());
  let n = new O(), o = new x();
  const i = document.querySelector(s);
  if (t && (n.activeRowIndex = t.game.rounds.length), i == null || i.append(n, o), t) {
    t.game.running || o.disable();
    for (let a = 0; a < t.game.rounds.length; a++) {
      const c = n.rows[a], d = t.game.rounds[a];
      let m = !0;
      c.isActive = !1, c.input = d.userGuess;
      for (let g = 0; g < d.letters.length; g++) {
        const _ = d.letters[g], f = c.cells[g];
        f.innerText = _.letterUser;
        const A = H(_);
        c.setInputStatusAtIndex(g, A), A !== w.green && (m = !1);
      }
      m && c.classList.add($), o.highlightLetters(d.letters);
    }
  }
  document.addEventListener(W, (a) => {
    const { input: c } = a.detail, d = {
      index: r.rounds.length,
      userGuess: c,
      letters: []
    };
    for (let m = 0; m < l.WORD_LENGTH; m++) {
      const g = c.charAt(m), _ = r.word.charAt(m), f = {
        letterActual: _,
        letterUser: g,
        isPresent: r.word.includes(g),
        isExactMatch: g === _
      };
      d.letters.push(f);
    }
    console.log("Round results"), console.table(d.letters), r.rounds.push(d), n.endOfRound(d.letters), o.highlightLetters(d.letters), h();
  }), document.addEventListener(P, async () => {
    r.word = await M(), r.rounds = [], r.timestamps.from = Date.now(), r.running = !0, console.log(`---------- New Game: "${r.word}" ----------`), n.replaceChildren(), n.remove(), o.replaceChildren(), o.remove(), requestAnimationFrame(() => {
      n = new O(), o = new x(), i == null || i.append(n, o);
    });
  });
  function h() {
    const a = r.rounds.some((d) => d.letters.every((m) => m.isExactMatch));
    if (l.MAX_ATTEMPTS !== r.rounds.length && !a) {
      y({ game: r, cfg: l, timestamp: Date.now() });
      return;
    }
    r.running = !1, r.timestamps.to = Date.now(), o.disable(), a && (r.win = !0, console.log(`[${r.word}] Game over! You won!`)), a || console.log(`[${r.word}] Game over! You lost`);
    const c = { game: r, cfg: l, timestamp: Date.now() };
    y(c), oe(c);
  }
}
re("#app");
export {
  l as cfg,
  r as game,
  re as run
};
