import { ShadowElement, define } from "@ognaf/core";

/**
 * This is a very simple component made for testing purposes that should be easy to understand.
 * Normally, there would be no need to use ShadowDom for this type of Component.
 */
define(
  "text-area",
  class extends ShadowElement {
    textarea = document.createElement("textarea");

    constructor() {
      super();
      this.shadow.innerHTML = /*html*/ `
		<style>
		textarea {
			resize: vertical;
		}

		textarea {
			width: 100%;
			width: -webkit-fill-available;
			max-width: 100%;
			max-width: -webkit-fill-available;
			padding: 8px 12px;
			border: 1px solid #eee;
			color: "#111";
			box-sizing: border-box; 
		}

		textarea:active {
			border: inherit;
		}

		textarea:valid {
			background: #white;
		}

		textarea:invalid {
			background: #fcf6f6;
		}

		</style>
		`;

      this.textarea.oninput = (e: InputEvent) => {
        const inputString = (e.target as HTMLTextAreaElement).value;
        this.autoExpand();

        const custom = new CustomEvent("ognaf-form-event", {
          detail: { value: inputString, validity: this.textarea.validity },
          composed: true,
          bubbles: true,
        });

        this.textarea.dispatchEvent(custom);
      };

      this.shadow.appendChild(this.textarea);
    }

    connectedCallback() {
      this.textarea.value = this.getAttribute("value") || "";
      this.autoExpand(); // Ensure it expands correctly when initialized with a value
    }

    autoExpand() {
      this.textarea.style.height = "auto";
      this.textarea.style.height = `${this.textarea.scrollHeight + 10}px`;
    }
  }
);
