import type { VNode } from 'vue'

export interface IRightMenuHandle {
  close: () => void
}

export type IRightMenuOptions = {
  customClass?: string
  center?: boolean
  dangerouslyUseHTMLString?: boolean // default false
  duration?: number // default 3000
  iconClass?: string
  id?: string
  message?: string | VNode
  offset?: number // defaults 20
  onClose?: (vm: VNode) => void
  showClose?: boolean // default false
  zIndex?: number
}

export type IRightMenuParams = IRightMenuOptions

export interface IRightMenu {
  (options?: IRightMenuParams) : IRightMenuHandle
}
