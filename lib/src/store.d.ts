type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;
export declare class Store<T> {
    #private;
    constructor(state: T);
    /**
     * Returns a copy of the current state of the store
     * @returns {T} copy of the current state
     */
    getState(): T;
    /**
   * Returns a copy of the previous state of the store
   * @returns {T} copy of the previous state
   */
    getPreviousState(): T;
    /**
     * setState updates the state in the store, and notify subscribers.
     * @param newState should be the entire, or apart of, the new state object.
     */
    setState(newState: Partial<T>): void;
    /**
     * subscribe takes an update method or function that will be called on state changes.
     * @param updateMethod
     * @returns {Symbol} The symbol used for unsubscribing.
     */
    subscribe(updateMethod: IUpdateMethod<T>): symbol;
    /**
     * unsubscribe removes the update method from the store, so that it will no longer be stored in memory,
     * or be called when the state changes.
     * @param subscriberToken {Symbol} The symbol received as return value from the subscribe method.
     */
    unsubscribe(subscriberToken: Symbol): void;
}
export {};
