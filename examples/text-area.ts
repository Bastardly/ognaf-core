import { ShadowElement, define } from "@ognaf/core";

/**
 * This is a styled textarea that expands automatically
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

      const computedStyle = window.getComputedStyle(this.textarea);
      const fontSize = computedStyle.getPropertyValue("font-size");
      this.textarea.oninput = (e: InputEvent) => {
        const inputString = (e.target as HTMLTextAreaElement).value;
        const lines = inputString.split(/\r\n|\r|\n/);
        const lineCount = lines.length;
        this.textarea.style.minHeight =
          lineCount * (parseFloat(fontSize) || 16) + "px";

        const custom = new CustomEvent("form-event", {
          detail: { value: inputString, validity: this.textarea.validity },
        });

        this.textarea.dispatchEvent(custom);
      };

      this.shadow.appendChild(this.textarea);
    }

    connectedCallback() {
      this.textarea.value = this.getAttribute("value") || "";
    }
  }
);
