import { createVNode, render, VNode } from 'vue';
import MessageConstructor from './index.vue';
import { ComponentPublicInstance } from 'vue';
import { IRightMenu, IRightMenuOptions, IRightMenuHandle, IRightMenuParams } from './types';

const PopupManager = {
  nextZIndex() {
    return 1;
  }
};

const RightMenu: IRightMenu = function(opts: IRightMenuParams = {} as IRightMenuParams): IRightMenuHandle {
  let options: IRightMenuOptions = <IRightMenuOptions>opts;

  options = {
    ...options,
    list: options.list,
    onClose: () => {
      close();
    },
    zIndex: PopupManager.nextZIndex()
  };

  const container = document.createElement('div');

  const vm: VNode = createVNode(MessageConstructor, options);

  render(vm, container);
  document.body.appendChild(container.firstElementChild as any);

  if (vm.props) {
    //  回收内存
    vm.props.onDestroy = () => {
      render(null, container);
    };
  }

  function close(): void {
    options.onClose?.(vm);
  }

  return {
    close: () => {
      if (vm.component) {
        (vm.component.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = false;
      }
    }
  };
} as any;

export default RightMenu;
