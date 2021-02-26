import { App } from 'vue'
import RightMenu from './src/rightMenu'
export default (app: App): void => {
  app.config.globalProperties.$rightMenu = RightMenu
}
