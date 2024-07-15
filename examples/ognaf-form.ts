import { ShadowElement, define } from "@ognaf/core";

/**
 * Very simple form example that can easily be connected to an external store service.
 */
define(
  "ognaf-form",
  class extends ShadowElement {
    form = document.createElement("form");

    constructor() {
      super();
      this.form.addEventListener("ognaf-form-event", (event: CustomEvent) => {
        console.log("We recieved a custom event", event);

        // Do magics with the values stored in event.detail
      });

      this.shadow.appendChild(this.form);

      const slotElement = document.createElement("slot");
      this.form.appendChild(slotElement);
    }

    connectedCallback() {
      const name = this.getAttribute("name");

      if (!name?.length) {
        throw "ofnaf form must have a name";
      }

      this.form.name = name;
    }
  }
);
