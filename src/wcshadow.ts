/**
 * ShadowElement extends HTMLElement and attaches shadowRoot as shadow.
 * 
 *  {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks|It has the following methods:}
 * 
 *  @example
 * connectedCallback()
 * Invoked when the ShadowElement is first connected to the DOM.
 * 
 * disconnectedCallback()
 * Invoked when the ShadowElement is disconnected from the DOM.
 * 
 * adoptedCallback()
 * Invoked when the ShadowElement is moved to a new document.
 * 
 * attributeChangedCallback(name, oldValue, newValue)
 * Invoked when one of the ShadowElement's attributes is added, removed, or changed.
 * When using attributeChangedCallback, remember to set observedAttributes as static.
 * E.g. static observedAttributes = ["guid", "variant"];
 * Otherwise attribute changes will be ignored.
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
}

/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 * @example 
 * import { define, ShadowElement } from "@ognaf/core";

 * define("hello-world", class extends ShadowElement {
    constructor() {
        super();
        this.shadow.innerHTML = "<div>Hello world!</div>";
    }
})
 * 
 * The define helper only define the custom element if it does not already exist. 
 * Otherwise, it will be ignored. Once the component is defined, we can access it anywhere 
 * in the DOM by its given name.
 * 
 * @example
 * <my-component></my-component>
 */
export function define(name: string, webcomponentClass: CustomElementConstructor, options?: ElementDefinitionOptions ) {
  if (!window.customElements?.get(name)) {
    window.customElements.define(name, webcomponentClass, options);
  }

  return name;
}
