var z = Object.defineProperty;
var D = (s) => {
  throw TypeError(s);
};
var Z = (s, t, e) => t in s ? z(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var g = (s, t, e) => Z(s, typeof t != "symbol" ? t + "" : t, e), k = (s, t, e) => t.has(s) || D("Cannot " + e);
var G = (s, t, e) => (k(s, t, "read from private field"), e ? e.call(s) : t.get(s)), N = (s, t, e) => t.has(s) ? D("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), S = (s, t, e, n) => (k(s, t, "write to private field"), n ? n.call(s, e) : t.set(s, e), e);
const T = "wored:row", C = "wored:letter", O = "wored:enter", x = "wored:backspace", X = "wored:core:row", J = "wored:core:reload", y = "wored-row", M = "wored-controller", W = "wored-keyboard", P = "wored-settings-dropdown", L = "wored:word", $ = "wored:history", _ = "wored:game", U = "wored-winning-row", Y = "wored-losing-row", Q = "wored-game-scope", f = {
  orange: "color-orange",
  green: "color-green",
  gray: "color-gray"
};
function F(s, t) {
  return s.getDate() === t.getDate() && s.getFullYear() === t.getFullYear() && s.getMonth() === t.getMonth();
}
function I(s) {
  return s.isExactMatch ? f.green : s.isPresent ? f.orange : f.gray;
}
function ee(s, t) {
  return (s.match(new RegExp(t, "g")) || []).length;
}
async function te(s) {
  return i.word === s ? !0 : fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${s}`).then((t) => t.json()).then((t) => (t == null ? void 0 : t.title) !== "No Definitions Found").catch(() => !1);
}
function ne(s) {
  const t = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, e = /\d/;
  return !t.test(s) && !e.test(s) && s.length === l.WORD_LENGTH;
}
var w;
class K extends HTMLElement {
  constructor() {
    super();
    g(this, "input", "");
    g(this, "isActive", !1);
    g(this, "cells", []);
    N(this, w, !1);
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
  async __handleEnter(e) {
    if (!(!this.isActive || !document.contains(this)) && (e.preventDefault(), console.log("Submitted Row"), !G(this, w))) {
      if (S(this, w, !0), !ne(this.input) || this.input.length !== l.WORD_LENGTH || !await te(this.input))
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
    this.replaceChildren(), this.isActive = !1, this.cells = [], document.removeEventListener(C, this.__handleLetter.bind(this)), document.removeEventListener(x, this.__handleBackspace.bind(this)), document.removeEventListener(O, this.__handleEnter.bind(this));
  }
  setInputStatusAtIndex(e, n) {
    this.cells[e].classList.add(n);
  }
}
w = new WeakMap();
class H extends HTMLElement {
  constructor() {
    super();
    g(this, "activeRowIndex");
    g(this, "rows");
    this.activeRowIndex = 0, this.rows = [];
    for (let e = 0; e < l.MAX_ATTEMPTS; e++) {
      const n = new K();
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
    const { input: n } = e.detail, o = new CustomEvent(X, {
      bubbles: !0,
      detail: { input: n },
      composed: !0
    });
    this.dispatchEvent(o);
  }
  endOfRound(e) {
    const n = this.activeRowIndex, o = this.rows[n];
    this.activeRowIndex++;
    let c = !0;
    for (let r = 0; r < o.cells.length; r++) {
      const E = e[r], a = I(E);
      o.setInputStatusAtIndex(r, a), a !== f.green && (c = !1);
    }
    c ? o.classList.add(U) : n + 1 === l.MAX_ATTEMPTS && o.classList.add(Y), this.updateListeners();
  }
}
const se = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"></path></svg>', oe = 3, ie = 12, re = 1, le = 16;
function B(s, t, e, n) {
  const o = document.createElement("select");
  o.addEventListener("input", n);
  const c = document.createElement("label");
  c.textContent = s;
  for (let r = t; r < e; r++) {
    const E = document.createElement("option");
    E.value = `${r}`, E.textContent = `${r}`, o.appendChild(E);
  }
  return {
    label: c,
    select: o
  };
}
class q extends HTMLElement {
  constructor() {
    super();
    g(this, "open", !1);
    g(this, "wrap", document.createElement("div"));
    g(this, "trigger", document.createElement("button"));
    const e = B(
      "Word Length",
      oe,
      ie,
      this.__handleWordLengthSelect.bind(this)
    );
    e.select.value = `${l.WORD_LENGTH}`;
    const n = B(
      "Attempts",
      re,
      le,
      this.__handleAttemptCountSelect.bind(this)
    );
    n.select.value = `${l.MAX_ATTEMPTS}`;
    const o = document.createElement("button");
    o.textContent = "Restart", o.addEventListener("click", this.__handleRestartGame.bind(this));
    const c = document.createElement("button");
    c.textContent = "New Word", c.addEventListener("click", this.__handleRefreshGame.bind(this)), this.wrap.classList.add("drp-wrap"), this.wrap.append(
      n.label,
      n.select,
      e.label,
      e.select,
      c,
      o
    ), this.trigger.innerHTML = se, this.trigger.classList.add("drp-trigger"), this.trigger.addEventListener("click", this.toggle.bind(this)), this.append(this.trigger, this.wrap);
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
    l.WORD_LENGTH = Number(e.target.value), localStorage.removeItem(_), localStorage.removeItem(L), this.toggle(), this.sendReloadEvent();
  }
  // Changed the amount of attempts
  __handleAttemptCountSelect(e) {
    l.MAX_ATTEMPTS = Number(e.target.value), localStorage.removeItem(_), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game and get an new word
  __handleRefreshGame() {
    localStorage.removeItem(_), localStorage.removeItem(L), this.toggle(), this.sendReloadEvent();
  }
  // Restart the game (but keep the word)
  __handleRestartGame() {
    localStorage.removeItem(_), this.toggle(), this.sendReloadEvent();
  }
}
const R = "qwertyuiopasdfghjkl$zxcvbnm#";
class A extends HTMLElement {
  constructor() {
    super();
    g(this, "buttons");
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
      const o = I(n), c = R.indexOf(n.letterUser);
      this.buttons[c].classList.add(o);
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
    if (!i.running)
      return;
    const { key: n } = e;
    R.includes(n) ? this.__letterHandler(n) : n === "Backspace" ? this.__backspaceHandler() : n === "Enter" && this.__enterHandler();
  }
}
function ae() {
  customElements.get(y) || customElements.define(y, K), customElements.get(M) || customElements.define(M, H), customElements.get(W) || customElements.define(W, A), customElements.get(P) || customElements.define(P, q);
}
function V(s) {
  localStorage.setItem(_, JSON.stringify(s));
}
function ce() {
  const s = localStorage.getItem(_);
  if (!s)
    return null;
  const t = JSON.parse(s);
  return F(/* @__PURE__ */ new Date(), new Date(t.timestamp)) ? t : (localStorage.removeItem(_), null);
}
function de(s) {
  const t = localStorage.getItem($);
  let e;
  t ? (e = JSON.parse(t), e.entries.push(s)) : e = {
    lastWrite: Date.now(),
    entries: [s]
  }, localStorage.setItem($, JSON.stringify(e));
}
const l = {
  WORD_LENGTH: 5,
  MAX_ATTEMPTS: 6
}, i = {
  running: !1,
  word: "",
  rounds: [],
  win: !1,
  timestamps: {
    from: 0,
    to: 0
  }
};
async function j() {
  const s = localStorage.getItem(L);
  if (s) {
    const t = JSON.parse(s), e = /* @__PURE__ */ new Date(), n = new Date(t.timestamp);
    if (F(e, n) && t.length === l.WORD_LENGTH)
      return Promise.resolve(t.word);
  }
  return fetch(`https://random-word-api.herokuapp.com/word?length=${l.WORD_LENGTH}`).then((t) => t.json()).then(([t]) => (localStorage.setItem(L, JSON.stringify({
    word: t,
    timestamp: Date.now(),
    length: l.WORD_LENGTH
  })), t)).catch((t) => {
    console.error(t);
  });
}
async function he(s) {
  ae(), console.clear();
  const t = ce(), e = t ? t.game.word : await j();
  console.log(`---------- New Game: "${e}" ----------`), t ? (Object.assign(i, t.game), Object.assign(i.timestamps, t.game.timestamps), Object.assign(l, t.cfg)) : (i.running = !0, i.word = e, i.timestamps.from = Date.now());
  let n = new H(), o = new A();
  const c = new q(), r = document.querySelector(s);
  if (t && (n.activeRowIndex = t.game.rounds.length), r == null || r.append(n, o, c), r == null || r.classList.add(Q), t) {
    t.game.running || o.disable();
    for (let a = 0; a < t.game.rounds.length; a++) {
      const d = n.rows[a], h = t.game.rounds[a];
      let p = !0;
      d.isActive = !1, d.input = h.userGuess;
      for (let u = 0; u < h.letters.length; u++) {
        const m = h.letters[u], v = d.cells[u];
        v.textContent = m.letterUser;
        const b = I(m);
        d.setInputStatusAtIndex(u, b), b !== f.green && (p = !1);
      }
      p ? d.classList.add(U) : a + 1 === l.MAX_ATTEMPTS && d.classList.add(Y), o.highlightLetters(h.letters);
    }
  }
  document.addEventListener(X, (a) => {
    const { input: d } = a.detail, h = {
      index: i.rounds.length,
      userGuess: d,
      letters: []
    }, p = {};
    for (let u = 0; u < l.WORD_LENGTH; u++) {
      const m = d.charAt(u), v = i.word.charAt(u);
      p[m] === void 0 ? p[m] = ee(i.word, m) - 1 : p[m]--;
      const b = {
        letterActual: v,
        letterUser: m,
        isPresent: p[m] >= 0,
        isExactMatch: m === v
      };
      h.letters.push(b);
    }
    console.log("Round results"), console.table(h.letters), i.rounds.push(h), n.endOfRound(h.letters), o.highlightLetters(h.letters), E();
  }), document.addEventListener(J, async () => {
    i.word = await j(), i.rounds = [], i.timestamps.from = Date.now(), i.running = !0, console.log(`---------- New Game: "${i.word}" ----------`), n.replaceChildren(), n.remove(), o.replaceChildren(), o.remove(), requestAnimationFrame(() => {
      n = new H(), o = new A(), r == null || r.append(n, o);
    });
  });
  function E() {
    const a = i.rounds.some((h) => h.letters.every((p) => p.isExactMatch));
    if (l.MAX_ATTEMPTS !== i.rounds.length && !a) {
      V({ game: i, cfg: l, timestamp: Date.now() });
      return;
    }
    i.running = !1, i.timestamps.to = Date.now(), o.disable(), a && (i.win = !0, console.log(`[${i.word}] Game over! You won!`)), a || console.log(`[${i.word}] Game over! You lost`);
    const d = { game: i, cfg: l, timestamp: Date.now() };
    V(d), de(d);
  }
}
he("#app");
export {
  l as cfg,
  i as game,
  he as run
};
