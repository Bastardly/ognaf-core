/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export declare class ShadowElement extends HTMLElement {
    static defaultOptions: ShadowRootInit;
    shadow: ShadowRoot;
    constructor(options?: ShadowRootInit);
    /**
     * Find element in shadowDom
     * Don't use in attributeChangedCallback or before dom has been written
     * @param query html query to find element in this.shadow
     */
    shadowSelector<T extends HTMLElement>(query: string): T;
    /**
     * Fetches a HTML template as a string.
     * NOTE! You cannot use scripts.
     * @param {string} src Source of the html template asset
     * @returns {string} html as string
     */
    getTemplate(src: string): Promise<string>;
}
/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export declare function define(name: string, webcomponentClass: CustomElementConstructor): string;
