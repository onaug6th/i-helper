import { createVNode, render, VNode } from 'vue';
import RegisterConstructor from './index.vue';

type RegsiterOptions = {
  type: string;
  visible: boolean;
};

let instance: any | null;

const Register: any = function(opts: RegsiterOptions = {} as RegsiterOptions): any {
  if (instance) {
    instance.close();
    instance = null;
  }

  let options: RegsiterOptions = <RegsiterOptions>opts;

  options = {
    ...options,
    visible: true
  };

  const container = document.createElement('div');

  const vm: VNode = createVNode(RegisterConstructor, options);

  render(vm, container);
  document.body.appendChild(container.firstElementChild as any);

  function close(): void {
    render(null, container);
  }

  instance = {
    close
  };

  return instance;
} as any;

export default Register;
