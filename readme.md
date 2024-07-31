# Oh God Not Another Framework (OGNAF)

OGNAF is a tiny clientside library that builds on the KISS principle (Keep It Simple, Stupid).

# Why use OGNAF?
OGNAF uses the bare-bone power of the modern browser - it just makes using it a little easier.
This has several benefits:

* Extremely small - [Less than 1kb minified and gzipped](https://bundlephobia.com/package/@ognaf/core)
* Agnostic - Can be used with any clientside framework.
* No dependencies - Which means fewer updates and less maintenence.
* Modular - Each DOM element can be isolated by using shadow DOM and by applying styling inside the component. This also means that less tooling is needed for whatever bundler you are using.
* Extendable - You can extend the classes and add your own methods and data to fit your needs.
* TypeScript friendly.

# Installation
Installation is fairly simple using [Node's](https://nodejs.org) package manager.

In your console, run:

```
npm install @ognaf/core
```

# What does OGNAF/core contain?
* define - A simple function that simplifies the creation of web components.
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

### Options (not recommended)
You can apply variants components existing components by using extends as an option.

However, using the extends option is NOT recommended because the 'is' property is [not supported by Safari](https://caniuse.com/mdn-html_global_attributes_is)

```TypeScript
define("custom-p", class extends HTMLParagraphElement {
    constructor() {
      super();
      this.onclick = () => console.log("Hello world!");
      this.style.fontSize = "1.2rem";  // Set default font size
      this.style.color = "red";        // Set default text color
      this.style.padding = "10px 20px"; // Add padding
    }
  }, { extends: 'p' })
```
You can then apply 'custom-p' to existing paragraph tags.

```Html
<p is="custom-p">Just look how custom I am!</p>
```


## ShadowElement
Shadow element is a small extention of the native [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) that uses [ShadowDOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM). It defines a public property called shadow, which is of type [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

Unlike shadowRoot, shadow is cannot be null, which means that you don't have to check if it exists, before applying changes.


### Example 1
Here is one way to create a component using shadowRoot. This is a button that shows how many times you've clicked it.

```TypeScript
import { define, ShadowElement } from "@ognaf/core"

define('local-counter', class extends ShadowElement {
    // Here we create the button instead of writing it through
    // this.shadow.innerHTML. This way we can access countButton,
    // without having to find it in shadowDOM first.
    countButton = document.createElement('button');

    count = 0;

    getCountText() {
        return 'Count: ' + this.count;
    }

    constructor() {
        super();

        // When using shadowDOM we can use styling directly 
        // without worrying about overspill to other components.
        this.shadow.innerHTML = `
            <style>
                button {
                    background: hotpink;
                }
            </style>
        `

        // Here we append countButton directly to the shadowDom
        this.shadow.appendChild(this.countButton)
        this.countButton.innerText = this.getCountText();
        this.countButton.onclick = () => {
            this.count += 1;
            this.countButton.innerText = this.getCountText();
        };
    }
})
```

### Example 2
Here, instead of defining elements in the constructor, we write the entire template as a string literal.
Again, this is a button that shows how many times you've clicked it.

```TypeScript
import { define, ShadowElement } from "@ognaf/core"

define('local-counter2', class extends ShadowElement {
    count = 0;

    getCountText() {
        return 'Count: ' + this.count;
    }

    // Invoked when the ShadowElement is first connected to the DOM.
    connectedCallback() {
        // In this example we also add a button to the innerHTML
        this.shadow.innerHTML = `
            <style>
                button {
                    background: hotpink;
                }
            </style>
            <button>${this.getCountText()}</button>
        `

        // By using shadowDOM, we can isolate the querySelector to the ShadowDOM.
        // Thereby limiting the scope.
        const countButton = this.shadow.querySelector<HTMLButtonElement>('button');
        countButton.onclick = () => {
            this.count += 1;
            countButton.innerText = this.getCountText();
        }
    }
})
```


## Store
Store is a state-holding observable.  Custom components can subscribe to the Store with an updateMethod which will be called on state changes. 
This allows us to handle data across multiple components.

### Constructor

The constructor takes the initial state of the Store as a parameter. The initial state must be an object. It then sets the Store's state and previous state to equal the initial state.
Since there are no subscribers during the construction of the Store, no re-renders will be triggered.

### Methods

For the types, we define the state of the store as T.

#### Store.getState(): T
Returns a copy of the state. 

#### Store.getPreviousState(): T
Returns a copy of the previous state.

#### Store.setState(partialState: Partial\<T\>): void
Sets state and notify all subscribers.

#### Store.subscribe(updateMethod: (newState: T, oldState: T) => void): Symbol
Allows the componenent to subscribe to state changes with an updateMethod.
It returns an unsubscription symbol which must be used to unsubscribe

#### Store.unsubscribe(subscriberToken: Symbol): void
Removes the connected updatemethod from the store.

### Bad example
This is an example of what not to do. It is bad practice to edit the store's state directly from the component. 
Here is an example of the previous counter button where I call the store from the location. 

The problem with this approach, is that we limit ourselves to the component. Also, the component becomes messy and harder to read,
which is very appearant in the getCountText method.


```TypeScript
import { define, ShadowElement, Store } from "@ognaf/core";

const store = new Store<Record<string, number>>({});

define('my-bad-counter', class extends ShadowElement {
    // Symbol to unsubscribe from store when the ShadowElement is 
    // removed from the page.
    subscriberToken: Symbol;

    storeKey = 'default_count'

    // observedAttributes whitelist the attributes we wish to observe.
    // This allows us to have multiple count buttons in the store.
    static get observedAttributes() {
        return ['storekey']
    }

    constructor() {
        super();
        // Here we subscribe to store changes. 
        // Then we can compare the changes we want, 
        // and fully control how we update our component
        this.subscriberToken = store.subscribe((newState, oldState) => {
            if (newState.count !== oldState.count) {
                 const countButton = this.shadow.querySelector<HTMLButtonElement>('button');

                 if (countButton) {
                     countButton.innerText = this.getCountText();
                 }
            }
        })
    }


    add(amount: number) {
        store.setState({
            [this.storeKey]: (store.getState()[this.storeKey] || 0) + amount,
        })
    }

    getCountText() {
        let storeCount = store.getState()[this.storeKey];

        if (storeCount === undefined) {
            storeCount = 0;
            this.add(0)
        }

        return 'Count: ' + storeCount;
    }

    
    connectedCallback() {
        // An individual storeKey passed to the component: 
        // <my-bad-counter storekey="myKey"></my-bad-counter>
        // The component needs to be connected to the DOM before we can get the attribute,
        // which is why we do it in the connectedCallback method.
        this.storeKey = this.getAttribute('storekey') || this.storeKey;

        this.shadow.innerHTML = `
            <style>
                button {
                    background: hotpink;
                }
            </style>
            <button>${this.getCountText()}</button>
        `

        const countButton = this.shadow.querySelector<HTMLButtonElement>('button');
        countButton.onclick = () => this.add(1);
    }

    // If the storekey changes, we reload the entire component.
    attributeChangedCallback() {
        this.connectedCallback();
    }

    // disconnectedCallback is a lifecycle method of the native HTMLElement
    // It is run when the element is removed from the page.
    disconnectedCallback() {
        store.unsubscribe(this.subscriberToken);
    }
})
```

### Better example
Here is an example of a better counter in typescript, where we utilize some of the different techniques used in the previous examples.


```TypeScript
import { define, ShadowElement, Store } from "@ognaf/core";

const store = new Store<Record<string, number>>({});

// Services can be reused across multiple components, and it removes logic from the components, 
// making them a lot cleaner.

const countService = {
    add: (storeKey: string, amount: number) => {
        store.setState({
            [storeKey]: (store.getState()[storeKey] || 0) + amount,
        })
    },

    getStoreCount: (storeKey: string) => {
        const storeCount = store.getState()[storeKey];

        if (Number.isInteger(storeCount)) {
            return storeCount;
        }

        countService.add(storeKey, 0)

        return 0;
    },

    getCountText: (storeKey: string) => {
        return 'Count: ' + countService.getStoreCount(storeKey);
    }
}

define('better-counter', class extends ShadowElement {
    subscriberToken: Symbol;

    countButton = document.createElement('button');

    storeKey = 'default_count'

    static get observedAttributes() {
        return ['storekey']
    }

    constructor() {
        super();

        this.subscriberToken = store.subscribe((newState, oldState) => {
            if (newState.count !== oldState.count) {
                this.countButton.innerText = countService.getCountText(this.storeKey);
            }
        })
    }
   
    connectedCallback() {
        this.storeKey = this.getAttribute('storekey') || this.storeKey;

        // Here we rewrite the shadowDOM. 
        this.shadow.innerHTML = `
            <style>
                button {
                    background: hotpink;
                }
            </style>
        `
        // Here we append the button instead of writing it to the template. 
        // This way we ensure that it's never undefined, and therefore we can avoid
        // a condition in the subscribtion method.
        this.shadow.appendChild(this.countButton)
        this.countButton.innerText = countService.getCountText(this.storeKey);
        this.countButton.onclick = () => countService.add(this.storeKey, 1);
    }

    attributeChangedCallback() {
        this.connectedCallback();
    }

    disconnectedCallback() {
        store.unsubscribe(this.subscriberToken);
    }
})
```
