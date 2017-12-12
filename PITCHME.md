
# Mobx
MobX is a battle tested library that makes state management simple and scalable by transparently applying functional reactive programming (TFRP). The philosophy behind MobX is very simple:

Anything that can be derived from the application state, should be derived. Automatically.

which includes the UI, data serialization, server communication, etc.

![Scheme](https://mobx.js.org/docs/flow.png)

##Concepts

###State
State is the data that drives your application. Usually there is domain specific state like a list of todo items and there is view state such as the currently selected element

###Derivations

- Computed values
These are values that can always be derived from the current observable state using a pure function.

- Reactions
 Reactions are side effects that need to happen automatically if the state changes.
 
###Actions
An action is any piece of code that changes the state. User events, backend data pushes, scheduled events, etc. An action is like a user that enters a new value in a spreadsheet cell.


```typescript
import {observable, computed, action, autorun, reaction} from 'mobx';

class TodoStore {
  @observable todos = [];
  @observable notRelatedList = [];

  @computed get count() {
    return this.todos.length;
  }

  @computed get doneCount() {
    return this.todos.filter(todo => todo.done).length;
  }

  @action addTodo(text, done = false) {
    this.todos.push({text, done});
  }

  @action modifyNotRelated() {
    this.notRelatedList.push(Math.random());
  }
}

const todoStore = new TodoStore();

const autorunUnsubscribe = autorun(() => {
  console.log("Completed todos", todoStore.doneCount)
})

const reactionUnsubscribe = reaction(
    () => todoStore.count,
    count => console.log("Todos count", count)
);

```

#Mobx State Tree

is a state container that combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

Central in MST (mobx-state-tree) is the concept of a living tree. The tree consists of mutable, but strictly protected objects enriched with runtime type information. In other words; each tree has a shape (type information) and state (data). From this living tree, immutable, structurally shared, snapshots are generated automatically.


```typescript
import { types, onSnapshot } from "mobx-state-tree"

const Todo = types.model("Todo", {
    title: types.string,
    done: false
}).actions(self => ({
    toggle() {
        self.done = !self.done
    }
}))

const Store = types.model("Store", {
    todos: types.array(Todo)
})

// create an instance from a snapshot
const store = Store.create({ todos: [{
    title: "Get coffee"
}]})

// listen to new snapshots
onSnapshot(store, (snapshot) => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ title: "Get coffee", done: true }]}`
```

Runtime errors support

!(Runtime error)[https://github.com/mobxjs/mobx-state-tree/blob/master/docs/tserror.png]

Because state trees are living, mutable models, actions are straight-forward to write; just modify local instance properties where appropriate. See `toggleTodo()` above or the examples below. It is not necessary to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.


A pretty unique feature of MST is that it offers liveliness guarantees; it will throw when reading or writing from objects that are no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.
