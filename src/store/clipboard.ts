import { reactiveStore } from './utils';

const clipboard = reactiveStore('clipboard', {
  isObserver: true
});

export default clipboard;
