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
}

/**
 * wcDefine helps defining custom components:
 * wcDefine('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export function wcDefine(name: string, webcomponentClass: CustomElementConstructor) {
  if (!window.customElements?.get(name)) {
    window.customElements.define(name, webcomponentClass);
  }

  return name;
}
