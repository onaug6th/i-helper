/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { specialKeyCode } from './keyCode';
import { mapActions } from 'vuex';

export default {
  name: 'keyDialog',
  props: {
    type: {
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
      //  实际提交的按钮文本
      key: '',
      //  展示的按键文本
      showText: '',
      //  用于记录按下的按键对象
      keys: {}
    };
  },
  watch: {
    visible() {
      this.showText = this.key = this.shortcutKey[this.type];
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

      const keysDetail = Object.keys(this.keys).reduce((prev, code) => {
        const text = specialKeyCode[code] || this.keys[code];

        const keyDetail = {
          code,
          text
        };
        prev.push(keyDetail);
        return prev;
      }, []);

      this.key = this.showText = keysDetail.map(({ text }) => text).join('+');
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
        type: this.type,
        key: this.key
      });

      if (success) {
        this.$notify({
          type: 'success',
          message: '设置成功'
        });

        this.setShortcutKey();
        this.$emit('close');
        this.visibleModel = false;
      } else {
        this.key = '';
        this.showText = '请重新键入';
      }
    }
  }
};
