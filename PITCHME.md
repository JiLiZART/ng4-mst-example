
# Mobx
MobX is a battle tested library that makes state management simple and scalable by transparently applying functional reactive programming (TFRP). 

---

## Philosophy

![Scheme](https://mobx.js.org/docs/flow.png)

---

The philosophy behind MobX is very simple:
Anything that can be derived from the application state, should be derived. Automatically.

which includes the UI, data serialization, server communication, etc.

---

## Concepts

---

### State
**State** is the data that drives your application. Usually there is domain specific state like a list of todo items and there is view state such as the currently selected element

---

### Derivations

- **Computed** values
<br>
These are values that can always be derived from the current observable state using a pure function.
- **Reactions**
<br>
 Reactions are side effects that need to happen automatically if the state changes.
 
---
 
### Actions

An action is any piece of code that changes the state. User events, backend data pushes, scheduled events, etc. An action is like a user that enters a new value in a spreadsheet cell.

---

```typescript
import {
  observable, 
  computed, action, 
  autorun, reaction
} from 'mobx';

class Todo {
  constructor(
    public @observable text, 
    public @observable done
  ) {}
}

class TodoStore {
  @observable todos = [];
  @observable notRelatedList = [];

  @computed get count() {
    return this.todos.length;
  }

  @computed get doneCount() {
    return this.todos
      .filter(todo => todo.done).length;
  }

  @action addTodo(text, done = false) {
    this.todos.push(new Todo(text, done));
  }

  @action modifyNotRelated() {
    this.notRelatedList.push(Math.random());
  }
}
```

---

```typescript
const todoStore = new TodoStore();

autorun(() => {
  console.log("Completed todos ", todoStore.doneCount)
})

// prints "Completed todos 0"

todoStore.addTodo("Done todo", true);

// prints "Completed todos 1"

todoStore.modifyNotRelated()

// prints nothing

reaction(
    () => todoStore.count,
    count => console.log("Todos count", count)
);

```

---

```
import { MobxAngularModule } from 'mobx-angular';

@NgModule({
    imports: [..., MobxAngularModule]
})
export class MyModule {}
```

---

```
import { 
  Component, 
  ChangeDetectionStrategy 
} from '@angular/core';
import {todoStore} from './store/todo';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *mobxAutorun>
      Completed todos {{ todoStore.doneCount }} / {{ todoStore.count }}
      <button (click)="todoStore.addTodo">Action</button>
    </div>
  `
})
export class AppComponent {
    store = todoStore;
}
```

---

# Mobx State Tree

is a `state` container that combines the simplicity and ease of mutable data with the traceability of immutable data and the reactiveness and performance of observable data.

---

Central in MST (mobx-state-tree) is the concept of a __living tree__. The tree consists of __mutable__, but __strictly protected objects__ enriched with __runtime type information__. In other words; each __tree has a shape__ (type information) and __state__ (data).

---

## Trees, types and state

With MobX state tree, you build, as the name suggests, __trees of models__.

Each node in the tree is described by two things: Its __type__ (the shape of the thing) and its __data__ (the state it is currently in).

---

The __types.model__ type declaration is used to describe the shape of an object. Other built-in types include arrays, maps, primitives etc.

---

```typescript
import {types} from "mobx-state-tree"

const Todo = types
  .model("Todo", {
      text: types.string,
      done: false
  })
  .actions(self => ({
      toggle() {
          self.done = !self.done
      }
  }))

const Store = types
  .model("Store", {
      todos: types.array(Todo)
  })

// create an instance from a snapshot
const store = Store.create({ 
  todos: [
    {text: "Get coffee"}
  ]
})
```

---

```typescript
// listen to new snapshots
onSnapshot(store, (snapshot) => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ text: "Get coffee", done: true }]}`
```

---

## Runtime errors support

![Runtime error](https://github.com/mobxjs/mobx-state-tree/raw/master/docs/tserror.png)

---

Because state trees are __living__, __mutable models__, actions are straight-forward to write; just modify local instance properties where appropriate. See __toggleTodo()__ above or the examples below. It is not necessary to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.

---

## Liveliness guarantees

A pretty unique feature of MST; it will throw when reading or writing from objects that are no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.

---

```typescript
const oldTodo = store.todos[0]
store.removeTodo(0)

function logAsyncTodo(todo) {
    setTimeout(
        () => console.log(todo.title),
        1000
    );
);

logAsyncTodo(store.todos[0])
store.removeTodo(0)
// throws exception in one second for using an stale object!
```

---

### Angular4 MST Demo

https://github.com/JiLiZART/ng4-mst-example
