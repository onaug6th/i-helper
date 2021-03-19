import { VNode } from 'vue';

export interface IRightMenuHandle {
  close: () => void;
}

export interface IRightMenuListItem {
  text: string;
  handler(): void;
  icon?: string;
}

export type IRightMenuOptions = {
  event: MouseEvent;
  list: Array<IRightMenuListItem>;
  onClose?: (vm: VNode) => void;
  zIndex?: number;
};

export type IRightMenuParams = IRightMenuOptions;

export interface IRightMenu {
  (options?: IRightMenuParams): IRightMenuHandle;
}
