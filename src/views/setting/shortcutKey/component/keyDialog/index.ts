import { createVNode, render, VNode } from 'vue';
import KeyDialogConstructor from './index.vue';
import { ComponentPublicInstance } from 'vue';
import { IKeyDialog, KeyDialogOptions, KeyDialogHandle, KeyDialogParams } from './types';

const KeyDialog: IKeyDialog = function(opts: KeyDialogParams = {} as KeyDialogParams): KeyDialogHandle {
  let options: KeyDialogOptions = <KeyDialogOptions>opts;

  options = {
    ...options,
    onClose: () => {
      close();
    }
  };

  const container = document.createElement('div');

  const vm: VNode = createVNode(KeyDialogConstructor, options);

  render(vm, container);
  document.body.appendChild(container.firstElementChild as any);

  function close(): void {
    options.onClose?.(vm);
    render(null, container);
  }

  return {
    close: () => {
      if (vm.component) {
        (vm.component.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = false;
      }
    }
  };
} as any;

export default KeyDialog;
