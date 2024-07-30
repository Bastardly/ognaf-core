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
        /**
         * #subscribers is a map of update methods, which will be run on state changes.
         */
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
            throw new Error("State provided in Store constructor is not a state-holding object.");
        }
        __classPrivateFieldSet(this, _Store_state, state, "f");
        __classPrivateFieldSet(this, _Store_oldState, state, "f");
    }
    /**
     * Returns a copy of the current state of the store
     * @returns {T} copy of the current state
     */
    getState() {
        return Object.assign({}, __classPrivateFieldGet(this, _Store_state, "f"));
    }
    /**
   * Returns a copy of the previous state of the store
   * @returns {T} copy of the previous state
   */
    getPreviousState() {
        return Object.assign({}, __classPrivateFieldGet(this, _Store_oldState, "f"));
    }
    /**
     * setState updates the state in the store, and notify subscribers.
     * @param newState should be the entire, or apart of, the new state object.
     */
    setState(newState) {
        const oldStateCopy = this.getPreviousState();
        __classPrivateFieldSet(this, _Store_state, Object.assign(Object.assign({}, __classPrivateFieldGet(this, _Store_state, "f")), newState), "f");
        const stateCopy = this.getState();
        __classPrivateFieldGet(this, _Store_subscribers, "f").forEach((subscriber) => subscriber(stateCopy, oldStateCopy));
        __classPrivateFieldSet(this, _Store_oldState, stateCopy, "f");
    }
    /**
     * subscribe takes an update method or function that will be called on state changes.
     * @param updateMethod
     * @returns {Symbol} The symbol used for unsubscribing.
     */
    subscribe(updateMethod) {
        const subscriberToken = Symbol();
        __classPrivateFieldGet(this, _Store_subscribers, "f").set(subscriberToken, updateMethod);
        return subscriberToken;
    }
    /**
     * unsubscribe removes the update method from the store, so that it will no longer be stored in memory,
     * or be called when the state changes.
     * @param subscriberToken {Symbol} The symbol received as return value from the subscribe method.
     */
    unsubscribe(subscriberToken) {
        if (!__classPrivateFieldGet(this, _Store_subscribers, "f").has(subscriberToken)) {
            throw new Error('SubscriberToken not found. The subscriberToken is the symbol returned from the subscribe method. This symbol must be a return value from subscribe method.');
        }
        __classPrivateFieldGet(this, _Store_subscribers, "f").delete(subscriberToken);
    }
}
_Store_subscribers = new WeakMap(), _Store_state = new WeakMap(), _Store_oldState = new WeakMap(), _Store_instances = new WeakSet(), _Store_isValidStateObject = function _Store_isValidStateObject(state) {
    return typeof state !== "object" && Array.isArray(state);
};
