import { createVNode, render, isVNode, VNode } from 'vue'
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

  if (typeof opts === 'string') {
    opts = {
      message: opts,
    }
  }

  let options: IRightMenuOptions = <IRightMenuOptions>opts

  options = {
    ...options,
    onClose: () => {
      options.onClose?.(vm);
    },
    zIndex: PopupManager.nextZIndex(),
  }

  const container = document.createElement('div')

  const message = options.message
  vm = createVNode(
    MessageConstructor,
    options,
    isVNode(options.message) ? { default: () => message } : null,
  )

  vm.props.onDestroy = () => {
    render(null, container)
  }

  render(vm, container)
  document.body.appendChild(container.firstElementChild as any)

  return {
    close: () => (vm.component.proxy as ComponentPublicInstance<{visible: boolean;}>).visible = false,
  }
} as any

export default RightMenu
