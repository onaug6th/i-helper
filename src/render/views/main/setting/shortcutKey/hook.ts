import { reactive } from 'vue';

export default function(store: { dispatch: (arg0: string) => void }): any {
  const state = reactive({
    //  设置的快捷键类型
    keyType: '',
    //  是否展示快捷键弹窗
    showDialog: false
  });

  /**
   * 打开按键设置弹窗
   * @param type 设置的快捷键类型
   */
  function openKeyDialog(type: string): void {
    state.showDialog = true;
    state.keyType = type;
  }

  return { state, store, openKeyDialog };
}
