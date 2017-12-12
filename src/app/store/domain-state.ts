import {runInAction} from 'mobx';
import {types, getSnapshot, applySnapshot, getParent, hasParent} from 'mobx-state-tree';
import {toStream} from 'mobx-utils';

import * as uuid from 'uuid/v4';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

export const Box = types
  .model('Box', {
    id: types.identifier(),
    name: 'hal',
    x: 0,
    y: 0
  })
  .views(self => ({
    get width() {
      return self.name.length * 15;
    },
    get isSelected() {
      if (!hasParent(self)) {
        return false;
      }

      return getParent(self, 2).selection === self;
    }
  }))
  .actions(self => ({
    move(dx, dy) {
      self.x += dx;
      self.y += dy;
    },
    setName(newName) {
      self.name = newName;
    }
  }));

export const Arrow = types.model('Arrow', {
  id: types.identifier(),
  from: types.reference(Box),
  to: types.reference(Box)
});

export const Store = types
  .model('Store', {
    boxes: types.map(Box),
    arrows: types.array(Arrow),
    selection: types.maybe(types.reference(Box))
  })
  .views(self => ({
    get boxes$() {
      const values = self.boxes.values();
      return Observable
        .from(toStream(() => values))
        .startWith(values);
    },

    get arrows$() {
      const values = self.arrows;

      return Observable
        .from(toStream(() => values))
        .startWith(values);
    },

    get boxesArray() {
      return self.boxes.values();
    }
  }))
  .actions((self: any) => ({
    addBox(name, x, y) {
      const box = Box.create({name, x, y, id: uuid()});
      self.boxes.put(box);
      return box;
    },
    addArrow(from, to) {
      self.arrows.push({id: uuid(), from, to});
    },
    setSelection(selection) {
      self.selection = selection;
    },
    createBox(name, x, y, source) {
      const box = self.addBox(name, x, y);

      self.setSelection(box);

      if (source) {
        self.addArrow(source.id, box.id);
      }
    }
  }));

/*
    The store that holds our domain: boxes and arrows
*/
const store = Store.create({
  boxes: {
    'ce9131ee-f528-4952-a012-543780c5e66d': {
      id: 'ce9131ee-f528-4952-a012-543780c5e66d',
      name: 'Rotterdam',
      x: 100,
      y: 100
    },
    '14194d76-aa31-45c5-a00c-104cc550430f': {
      id: '14194d76-aa31-45c5-a00c-104cc550430f',
      name: 'Bratislava',
      x: 650,
      y: 300
    }
  },
  arrows: [
    {
      id: '7b5d33c1-5e12-4278-b1c5-e4ae05c036bd',
      from: 'ce9131ee-f528-4952-a012-543780c5e66d',
      to: '14194d76-aa31-45c5-a00c-104cc550430f'
    }
  ],
  selection: null
});

export {
  store
};

window['store'] = store; // for demo

/**
 Generate 'amount' new random arrows and boxes
 */
export function generateStuff(amount) {
  runInAction(() => {
    for (let i = 0; i < amount; i++) {
      store.addBox(
        '#' + i,
        Math.random() * window.innerWidth * 0.5,
        Math.random() * window.innerHeight
      );
    }
    const allBoxes = store.boxes.values();
    for (let i = 0; i < amount; i++) {
      store.addArrow(
        allBoxes[Math.floor(Math.random() * allBoxes.length)],
        allBoxes[Math.floor(Math.random() * allBoxes.length)]
      );
    }
  });
}
