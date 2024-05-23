# Oh God Not Another Framework (OGNAF)

_WORK IN PROGRESS_

OGNAF is a tiny clientside framework that builds on the Keep It Simple, Stupid (KISS) principle.  
It functions as an ice-breaker to start using the power of web components and the native tools of the browser.

## Why use OGNAF?
The creation of OGNAF was motivated by creating a tiny modular framework that utilizes the bare-bone power of the browser.
This has several benefits:

* Extremely small - [Less than 1kb minified and gzipped](https://bundlephobia.com/package/@ognaf/core@0.1.9)
* Agnostic - Can be used with any clientside framework.
* No dependencies - OGNAF has no dependencies - Which means fewer updates and less maintenence.
* Modular - Each DOM element can be isolated by using shadow DOM and by applying styling inside the component. This also means that less tooling is needed for whatever bundler you are using.
* Extendable - You can extend the classes and add your own methods and data to fit your needs.

## What does OGNAF/core contain?
* define - A simple function that simplifies the creating of web components.
* ShadowElement - Which is basically a standard HTMLElement with an applied shadowDOM. 
* Store - A store class to create observable stores. A web component can then easily subscribe to the stores, and apply updates as the data changes.



### Define
The define method is used to create define a custom element.

`define("hello-world", class extends HTMLElement {
    connectedCallback() {
        this.innerHtml = "<div>Hello world!</div>";
    }
})`

Define only define the custom element if it does not already exist. Otherwise, it will be ignored.

### ShadowElement
Shadow element is a native HTMLElement that uses shadowDOM. It has a predefined property called shadow, which is of type ShadowRoot, but is not null.

`define("hello-world", class extends ShadowElement {
    connectedCallback() {
        this.shadow.innerHtml = "<div>Hello world!</div>";
    }
})`

### Store
_WORK IN PROGRESS_