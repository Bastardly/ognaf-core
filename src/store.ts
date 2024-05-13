type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;

export class Store<T extends Record<string, unknown>> {
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
    this.#state = state;

    this.#oldState = state;

    if (this.#isValidStateObject(state)) {
      throw new Error("State provided in Store constructor is not an object.");
    }
  }

  /**
   * Checks to see if the object is indeed an object.
   */
  #isValidStateObject(state: Partial<T>) {
    return typeof state !== "object" && Array.isArray(state)
  }

  /**
   * Returns the current state of the store
   * @returns {T} current state
   */
  getState() {
    return { ...this.#state };
  }

    /**
   * Returns the previous state of the store
   * @returns {T} previous state
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


  subscribe(updateMethod: IUpdateMethod<T>) {
    const unsubscriber = Symbol();

    this.#subscribers.set(unsubscriber, updateMethod);

    return unsubscriber;
  }

  unsubscribe(unsubscriber: Symbol) {
    if (!this.#subscribers.has(unsubscriber)) {
      throw new Error('Unsubscriber symbol must be the same as when subscribing')
    }

    this.#subscribers.delete(unsubscriber);
  }
}
