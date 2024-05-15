var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * ShadowElement extends HTMLElement and attaches shadowRoot and applies a couple of utility methods.
 */
export class ShadowElement extends HTMLElement {
    constructor(options) {
        super();
        this.shadow = this.attachShadow(options || ShadowElement.defaultOptions);
    }
    /**
     * Find element in shadowDom
     * Don't use in attributeChangedCallback or before dom has been written
     * @param query html query to find element in this.shadow
     */
    shadowSelector(query) {
        return this.shadow.querySelector(query);
    }
    /**
     * Fetches a HTML template as a string.
     * NOTE! You cannot use scripts.
     * @param {string} src Source of the html template asset
     * @returns {string} html as string
     */
    getTemplate(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(src);
            return response.text();
        });
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
