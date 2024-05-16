# Oh God Not Another Framework (OGNAF)

_WORK IN PROGRESS_

OGNAF is a tiny clientside framework that builds on the Keep It Simple, Stupid (KISS) principle.  
It functions as an ice-breaker to start using the power of web components and the native tools of the browser.

## Why use OGNAF?
* Extremely small - [Less than 1kb minified and gzipped](https://bundlephobia.com/package/@ognaf/core@0.1.9)
* Agnostic - Can be used with any clientside framework.
* No dependencies - OGNAF has no dependencies - Which means fewer updates and less maintenence.
* Modular - Each DOM element can be isolated by using shadow DOM and by applying styling inside the component. This also means that less tooling is needed for whatever bundler you are using.
* Extendable - You can add your own methods and data by extending the classes.

## What does OGNAF/core contain?
* ShadowElement - Which is basically a standard HTMLElement with an applied shadowDOM. 
* define - A simple function that simplifies the creating of web components.
* Store - A store class to create observable stores. A web component can then easily subscribe to the stores, and apply updates as the data changes.

## How to use OGNAF
_WORK IN PROGRESS_