/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export declare class ShadowElement extends HTMLElement {
    static defaultOptions: ShadowRootInit;
    shadow: ShadowRoot;
    /**
     * Constructor takes the same options as when creating a custom component with a shadow dom.
     * It defaults to { mode: 'open' }
     * @param {ShadowRootInit} options
     */
    constructor(options?: ShadowRootInit);
}
/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export declare function define(name: string, webcomponentClass: CustomElementConstructor): string;
