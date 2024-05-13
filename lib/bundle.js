/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
class ShadowElement extends HTMLElement {
    constructor(options) {
        super();
        this.shadow = this.attachShadow(options || ShadowElement.defaultOptions);
    }
}
ShadowElement.defaultOptions = {
    mode: "open",
};
/**
 * wcDefine helps defining custom components:
 * wcDefine('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
function wcDefine(name, webcomponentClass) {
    var _a;
    if (!((_a = window.customElements) === null || _a === void 0 ? void 0 : _a.get(name))) {
        window.customElements.define(name, webcomponentClass);
    }
    return name;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _Store_instances, _Store_subscribers, _Store_state, _Store_oldState, _Store_isValidStateObject;
class Store {
    constructor(state) {
        _Store_instances.add(this);
        _Store_subscribers.set(this, new Map());
        /**
         * #state is the current state in store
         */
        _Store_state.set(this, void 0);
        /**
         * #oldState is the former state in store
         */
        _Store_oldState.set(this, void 0);
        __classPrivateFieldSet(this, _Store_state, state, "f");
        __classPrivateFieldSet(this, _Store_oldState, state, "f");
        if (__classPrivateFieldGet(this, _Store_instances, "m", _Store_isValidStateObject).call(this, state)) {
            throw new Error("State provided in Store constructor is not an object.");
        }
    }
    /**
     * Returns the current state of the store
     * @returns {T} current state
     */
    getState() {
        return Object.assign({}, __classPrivateFieldGet(this, _Store_state, "f"));
    }
    /**
   * Returns the previous state of the store
   * @returns {T} previous state
   */
    getPreviousState() {
        return Object.assign({}, __classPrivateFieldGet(this, _Store_oldState, "f"));
    }
    /**
     * setState updates the state in the store, and notify subscribers.
     * @param newState should be the entire, or apart of, the new state object.
     */
    setState(newState) {
        const stateCopy = this.getState();
        const oldStateCopy = this.getPreviousState();
        __classPrivateFieldSet(this, _Store_state, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _Store_state, "f")), newState), "f");
        __classPrivateFieldGet(this, _Store_subscribers, "f").forEach((subscriber) => subscriber(__classPrivateFieldGet(this, _Store_state, "f"), oldStateCopy));
        __classPrivateFieldSet(this, _Store_oldState, stateCopy, "f");
    }
    subscribe(updateMethod) {
        const unsubscriber = Symbol();
        __classPrivateFieldGet(this, _Store_subscribers, "f").set(unsubscriber, updateMethod);
        return unsubscriber;
    }
    unsubscribe(unsubscriber) {
        if (!__classPrivateFieldGet(this, _Store_subscribers, "f").has(unsubscriber)) {
            throw new Error('Unsubscriber symbol must be the same as when subscribing');
        }
        __classPrivateFieldGet(this, _Store_subscribers, "f").delete(unsubscriber);
    }
}
_Store_subscribers = new WeakMap(), _Store_state = new WeakMap(), _Store_oldState = new WeakMap(), _Store_instances = new WeakSet(), _Store_isValidStateObject = function _Store_isValidStateObject(state) {
    return typeof state !== "object" && Array.isArray(state);
};

export { ShadowElement, Store, wcDefine };
