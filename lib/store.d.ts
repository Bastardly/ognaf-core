type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;
export declare class Store<T> {
    #private;
    constructor(state: T);
    /**
     * Returns the current state of the store
     * @returns {T} current state
     */
    getState(): T;
    /**
   * Returns the previous state of the store
   * @returns {T} previous state
   */
    getPreviousState(): T;
    /**
     * setState updates the state in the store, and notify subscribers.
     * @param newState should be the entire, or apart of, the new state object.
     */
    setState(newState: Partial<T>): void;
    subscribe(updateMethod: IUpdateMethod<T>): symbol;
    unsubscribe(unsubscriber: Symbol): void;
}
export {};
