import { createVNode, render, VNode } from 'vue'
import MessageConstructor from './index.vue'
import type { ComponentPublicInstance } from 'vue'
import type {
  IRightMenu,
  IRightMenuOptions,
  IRightMenuHandle,
  IRightMenuParams,
} from './types'

const PopupManager = {
  nextZIndex() {
    return 1;
  }
}

const RightMenu: IRightMenu = function(
  opts: IRightMenuParams = {} as IRightMenuParams,
): IRightMenuHandle {
  let vm: VNode;

  let options: IRightMenuOptions = <IRightMenuOptions>opts;

  options = {
    ...options,
    list: options.list,
    onClose: () => {
      options.onClose?.(vm);
    },
    zIndex: PopupManager.nextZIndex(),
  }

  const container = document.createElement('div');

  vm = createVNode(
    MessageConstructor,
    options
  );

  render(vm, container)
  document.body.appendChild(container.firstElementChild as any)

  //  回收内存
  vm.props.onDestroy = () => {
    render(null, container)
  }

  return {
    close: () => (vm.component.proxy as ComponentPublicInstance<{visible: boolean;}>).visible = false,
  }
} as any

export default RightMenu
