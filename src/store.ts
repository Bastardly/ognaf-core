type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;

export class Store<T> {
  #subscribers = new Map<Symbol, IUpdateMethod<T>>();

  /**
   * #state is the current state in store
   */
  #state: T;

  /**
   * #oldState is the former state in store
   */
  #oldState: T;

  constructor(state: T) {
    if (this.#isValidStateObject(state)) {
      throw new Error("State provided in Store constructor is not an object.");
    }

    this.#state = state;

    this.#oldState = state;
  }

  /**
   * Checks to see if the object is indeed an object.
   */
  #isValidStateObject(state: Partial<T>) {
    return typeof state !== "object" && Array.isArray(state)
  }

  /**
   * Returns a copy of the current state of the store
   * @returns {T} copy of the current state
   */
  getState() {
    return { ...this.#state };
  }

    /**
   * Returns a copy of the previous state of the store
   * @returns {T} copy of the previous state
   */
  getPreviousState() {
    return { ...this.#oldState };
  }

  /**
   * setState updates the state in the store, and notify subscribers.
   * @param newState should be the entire, or apart of, the new state object.
   */
  setState(newState: Partial<T>) {
    const stateCopy = this.getState();
    const oldStateCopy = this.getPreviousState();

    this.#state = {
      ...this.#state,
      ...newState,
    };

    this.#subscribers.forEach((subscriber) =>
      subscriber(this.#state, oldStateCopy)
    );
    this.#oldState = stateCopy;
  }

  /**
   * subscribe takes an update method or function that will be called on state changes.  
   * @param updateMethod 
   * @returns {Symbol} The symbol used for unsubscribing.
   */
  subscribe(updateMethod: IUpdateMethod<T>) {
    const unsubscriber = Symbol();

    this.#subscribers.set(unsubscriber, updateMethod);

    return unsubscriber;
  }

  /**
   * unsubscribe removes the update method from the store, so that it will no longer be stored in memory,
   * or be called when the state changes.
   * @param unsubscriber {Symbol} The symbol received as return value from the subscribe method.
   */
  unsubscribe(unsubscriber: Symbol) {
    if (!this.#subscribers.has(unsubscriber)) {
      throw new Error('Unsubscriber symbol must be the same as when subscribing')
    }

    this.#subscribers.delete(unsubscriber);
  }
}
