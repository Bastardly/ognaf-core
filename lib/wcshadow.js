/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export class ShadowElement extends HTMLElement {
    constructor(options) {
        super();
        this.shadow = this.attachShadow(options || ShadowElement.defaultOptions);
    }
}
ShadowElement.defaultOptions = {
    mode: "open",
};
/**
 * define helps defining custom components:
 * define('custom-name', class extends ShadowElement { ... })
 * @returns {string} name used to define custom component
 */
export function define(name, webcomponentClass) {
    var _a;
    if (!((_a = window.customElements) === null || _a === void 0 ? void 0 : _a.get(name))) {
        window.customElements.define(name, webcomponentClass);
    }
    return name;
}
