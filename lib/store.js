var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Store_instances, _Store_subscribers, _Store_state, _Store_oldState, _Store_isValidStateObject;
export class Store {
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
        if (__classPrivateFieldGet(this, _Store_instances, "m", _Store_isValidStateObject).call(this, state)) {
            throw new Error("State provided in Store constructor is not an object.");
        }
        __classPrivateFieldSet(this, _Store_state, state, "f");
        __classPrivateFieldSet(this, _Store_oldState, state, "f");
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
