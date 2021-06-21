import { useStore } from "./inject-key";
import Store from "./store"

function createStore(options) {
  return new Store(options);
}

export {
  useStore,
  createStore
};