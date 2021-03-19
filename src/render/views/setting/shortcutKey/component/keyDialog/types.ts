import { VNode } from 'vue';

export interface KeyDialogHandle {
  close: () => void;
}

export type KeyDialogOptions = {
  event: MouseEvent;
  onClose?: (vm: VNode) => void;
};

export type KeyDialogParams = KeyDialogOptions;

export interface IKeyDialog {
  (options?: KeyDialogParams): KeyDialogHandle;
}
