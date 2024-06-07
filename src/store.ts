type IUpdateMethod<T> = (newState: T, oldState: T) => void | Promise<void>;

export class Store<T> {
  /**
   * #subscribers is a map of update methods, which will be run on state changes.
   */
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
      throw new Error("State provided in Store constructor is not a state-holding object.");
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
    const subscriberToken = Symbol();

    this.#subscribers.set(subscriberToken, updateMethod);

    return subscriberToken;
  }

  /**
   * unsubscribe removes the update method from the store, so that it will no longer be stored in memory,
   * or be called when the state changes.
   * @param subscriberToken {Symbol} The symbol received as return value from the subscribe method.
   */
  unsubscribe(subscriberToken: Symbol) {
    if (!this.#subscribers.has(subscriberToken)) {
      throw new Error('SubscriberToken not found. The subscriberToken is the symbol returned from the subscribe method. This symbol must be a return value from subscribe method.')
    }

    this.#subscribers.delete(subscriberToken);
  }
}
