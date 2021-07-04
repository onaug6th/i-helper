/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { keysWords, specialKeyCode } from './keyCode';
import { mapActions } from 'vuex';

export default {
  name: 'keyDialog',
  props: {
    keyType: {
      type: String,
      default: ''
    },
    shortcutKey: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //  弹窗的展示控制
      dialogVisible: false,
      //  实际提交的按键值
      keyValue: '',
      //  展示的按键文本
      showText: '',
      //  用于记录按下的按键对象
      keys: {}
    };
  },
  watch: {
    visible() {
      this.showText = this.keyValue = this.shortcutKey[this.keyType];
    }
  },
  computed: {
    visibleModel: {
      get() {
        return this.visible;
      },
      set(visible: boolean) {
        this.$emit('update:visible', visible);
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.watchingKeyDown);
    document.addEventListener('keyup', this.clearKeys);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.watchingKeyDown);
    document.removeEventListener('keyup', this.clearKeys);
  },
  methods: {
    ...mapActions({ setShortcutKey: 'app/setShortcutKey' }),
    /**
     * 清除缓存的按键对象
     * @param event
     */
    clearKeys(event) {
      delete this.keys[event.keyCode];
    },

    /**
     * 监听键盘按下
     * @param { Event } event
     */
    watchingKeyDown(event) {
      const key = event.key.toUpperCase();

      this.keys[event.keyCode] = key;

      const keysDetail = Object.keys(this.keys).reduce((prev, keyCode) => {
        const key = specialKeyCode[keyCode] || this.keys[keyCode];

        const keyDetail = {
          keyCode,
          key
        };
        prev.push(keyDetail);
        return prev;
      }, []);

      /**
       * 如果按键为如下内容
       * 1. 全都为ctrl/shift/alt，没有其他键
       * 不合法
       */
      const effective = keysDetail.some(keyItem => !keysWords.includes(keyItem.keyCode));

      if (effective) {
        this.keyValue = this.showText = keysDetail.map(({ key }) => key).join('+');
      } else {
        this.keyValue = '';
        this.showText = '请继续键入';
      }
    },

    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('close');
      this.visibleModel = false;
    },

    /**
     * 确认
     */
    async confirm() {
      const success = await this.$ipcClient('shortcutKey-update', {
        keyType: this.keyType,
        keyValue: this.keyValue
      });

      if (success) {
        this.$notify({
          type: 'success',
          message: '设置成功'
        });

        //  获取应用快捷键设置
        this.setShortcutKey();

        this.$emit('close');
        this.visibleModel = false;
      } else {
        this.$notify({
          type: 'error',
          message: '快捷键已被占用，设置失败'
        });
        this.keyValue = '';
        this.showText = '请重新键入';
      }
    }
  }
};
