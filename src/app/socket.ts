// eslint-disable-next-line
import {
  onSnapshot,
  applySnapshot,
  onPatch,
  applyPatch,
  onAction,
  applyAction
} from 'mobx-state-tree';

let subscription;

export function syncStoreWithBackend(socket, store) {
  // === SYNC PATCHES (recommended)
  subscription = onPatch(store, (data) => {
    console.log('patch', data);
    socketSend(data);
  });

  onSocketMessage((data) => {
      applyPatch(store, data);
  });

  // === SYNC ACTIONS
  // subscription = onAction(store, data => {
  //   console.log('onAction', data);
  //   socketSend(data);
  // });
  //
  // onSocketMessage(data => {
  //   console.log('applyAction', data);
  //   applyAction(store, data);
  // });

  // === SYNC SNAPSNOTS
  // subscription = onSnapshot(store, (data) => {
  //   console.log('onSnapshot', data);
  //   socketSend(data);
  // });
  //
  // onSocketMessage((data) => {
  //   console.log('applySnapshot', data);
  //   applySnapshot(store, data);
  // });

  let isHandlingMessage = false;

  function socketSend(data) {
    if (!isHandlingMessage) {
      socket.send(JSON.stringify(data));
    }
  }

  function onSocketMessage(handler) {
    socket.onmessage = event => {
      isHandlingMessage = true;
      handler(JSON.parse(event.data));
      isHandlingMessage = false;
    };
  }
}
