import { reactiveStorage } from './utils';

const clipboard = reactiveStorage('clipboard', {
  isObserver: true
});

export default clipboard;
