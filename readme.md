# Oh God Not Another Framework (OGNAF)

_WORK IN PROGRESS_

OGNAF is a tiny clientside "framework" that builds on the Keep It Simple, Stupid (KISS) principle.  

# Why use OGNAF?
The motivation of OGNAF is the bare-bone power of the modern browser. OGNAF just makes using that power a little easier.
Apart from that, OGNAF has several benefits:

* Extremely small - [Less than 1kb minified and gzipped](https://bundlephobia.com/package/@ognaf/core@0.1.9)
* Agnostic - Can be used with any clientside framework.
* No dependencies - OGNAF has no dependencies - Which means fewer updates and less maintenence.
* Modular - Each DOM element can be isolated by using shadow DOM and by applying styling inside the component. This also means that less tooling is needed for whatever bundler you are using.
* Extendable - You can extend the classes and add your own methods and data to fit your needs.
* TypeScript friendly.

# What does OGNAF/core contain?
* define - A simple function that simplifies the creating of web components.
* ShadowElement - Which is basically a standard HTMLElement with an applied shadowDOM. 
* Store - A store class to create observable stores. A web component can then easily subscribe to the stores, and apply updates as the data changes.

## Define
The define method is used to create define a custom element.

```TypeScript
import { define } from "@ognaf/core";

define("hello-world", class extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = "<div>Hello world!</div>";
    }
})
```

The define helper only define the custom element if it does not already exist. Otherwise, it will be ignored. Once the 'hello-world' component is defined, we can access it anywhere in the DOM by writing.

```Html
    <hello-world></hello-world>
```

## ShadowElement
Shadow element is a small extention of the native [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) that uses [shadowDOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM). It defines a public property called shadow, which is of type [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot), but is not null.

```TypeScript
import { define, ShadowElement } from "@ognaf/core";

define("hello-shadow", class extends ShadowElement {
    constructor() {
        // ShadowRoot mode is default set to open. You can pass shadowRoot options through super
        // E.g. super({mode: 'closed'}); // Closed shadowRoot
        super();

        // When using shadowDOM we can use styling directly 
        // without worrying about overspill to other components.
        this.shadow.innerHTML = `
            <style>
                div {
                    padding: 8px;
                    border: 2px solid hotpink;
                    border-radius: 4px;
                }
            </style>
            <div>Hello shadow!</div>
        `;
    }
})
```

## Store
Store is a state-holding observable. The state must be an object. Custom components can subscribe to the Store with an updateMethod which will be called on state changes. 

### Constructor

WIP

### Methods

For the types, we define the state of the store as T.

#### Store.getState(): T
Returns a copy of the state. 

#### Store.getPreviousState(): T
Returns a copy of the previous state.

#### Store.setState(partialState: Partial<T>): void
Sets state and notify all subscribers.

#### Store.subscribe(updateMethod: (newState: T, oldState: T) => void): Symbol
Allows the componenent to subscribe to state changes with an updateMethod.
It returns an unsubscription symbol which must be used to unsubscribe

#### Store.unsubscribe(unsubscriber: Symbol): void
Removes the connected updatemethod from the store.

### Example
Here is an example of a counter in typescript:


```TypeScript
import { define, ShadowElement, Store } from "@ognaf/core";

interface IState {
	count: number
}

const store = new Store<IState>({
	count: 0
});

// Use services to handle state changes, since services can be reused
class CountService {
    addOne() {
        store.setState({
            count: store.getState().count + 1
        })
    }

    getCountText(newCount: number) {
        return 'Count: ' + newCount;
    }
}

const countService = new CountService();

define('my-counter', class extends ShadowElement {
    // Symbol to unsubscribe from store when the ShadowElement is 
    // removed from the page.
    unsubscriber: Symbol;

    // Here we create the button instead of writing it through
    // this.shadow.innerHTML. This way we can access countButton,
    // without having to find it in shadowDOM first.
    countButton = document.createElement('button');

    constructor() {
        super();
        this.shadow.innerHTML = `
            <style>
                button {
                    background: hotpink;
                }
            </style>
        `

        // Here we append countButton directly to the shadowDom
        this.shadow.appendChild(this.countButton)
        this.countButton.innerText = countService.getCountText(store.getState().count);
        this.countButton.onclick = () => countService.addOne();

        // Here we subscribe to store changes. 
        // Then we can compare the changes we want, 
        // and fully control how we update our component
        this.unsubscriber = store.subscribe((newState, oldState) => {
            if (newState.count !== oldState.count) {
                this.countButton.innerText = countService.getCountText(newState.count);
            }
        })
    }

    // disconnectedCallback is a lifecycle method of the native HTMLElement
    // It is run when the element is removed from the page.
    disconnectedCallback() {
        store.unsubscribe(this.unsubscriber);
    }
})
```

Now all 'my-counter' elements will update whenever one is clicked.

```Html
<my-counter></my-counter>
<my-counter></my-counter>

```

_WORK IN PROGRESS_