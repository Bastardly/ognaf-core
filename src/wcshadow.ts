/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export class ShadowElement extends HTMLElement {
  static defaultOptions = {
    mode: "open",
  } as ShadowRootInit;

  shadow: ShadowRoot;

  /**
   * Constructor takes the same options as when creating a custom component with a shadow dom. 
   * It defaults to { mode: 'open' }
   * @param {ShadowRootInit} options 
   */
  constructor(options?: ShadowRootInit) {
    super();
    this.shadow = this.attachShadow(options || ShadowElement.defaultOptions);
  }

  	/**
	 * Find element in shadowDom, assuming it exists by typecasting generic. 
   * This is not best practice, but useful when you don't want clog small scope components.
	 * Don't use in attributeChangedCallback or before dom has been written
	 * @param query html query to find element in this.shadow
	 */
	shadowSelector<T extends HTMLElement>(query: string) {
		return this.shadow.querySelector(query) as T;
	}
}

/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export function define(name: string, webcomponentClass: CustomElementConstructor) {
  if (!window.customElements?.get(name)) {
    window.customElements.define(name, webcomponentClass);
  }

  return name;
}
