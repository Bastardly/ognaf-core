/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export class ShadowElement extends HTMLElement {
  static defaultOptions = {
    mode: "open",
  } as ShadowRootInit;

  shadow: ShadowRoot;

  constructor(options?: ShadowRootInit) {
    super();
    this.shadow = this.attachShadow(options || ShadowElement.defaultOptions);
  }

  	/**
	 * Find element in shadowDom
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
