/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export declare class ShadowElement extends HTMLElement {
    static defaultOptions: ShadowRootInit;
    shadow: ShadowRoot;
    constructor(options?: ShadowRootInit);
}
/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export declare function define(name: string, webcomponentClass: CustomElementConstructor): string;
