/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ipcRenderer } from 'electron';

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    shortcutKeys: {
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
      dialogVisible: false,
      keyStr: ''
    };
  },
  watch: {
    visible() {
      this.keyStr = this.key = this.shortcutKeys[this.type];
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
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.watchingKeyDown);
  },
  methods: {
    /**
     * 监听键盘按下
     * @param { Event } event
     */
    watchingKeyDown(event) {
      let key = event.key.toUpperCase();

      const ctrlKey = event.ctrlKey ? 'Ctrl' : '';
      const shiftKey = event.shiftKey ? 'Shift' : '';
      const altKey = event.altKey ? 'Alt' : '';
      const combKey = [ctrlKey, shiftKey, altKey].filter(Boolean);

      switch (event.keyCode) {
        case 32: {
          key = 'Space';
          break;
        }
      }

      if ([16, 17, 18].includes(event.keyCode)) {
        this.key = '';
        this.keyStr = '请继续键入';
        return;
      }

      //  如没有ctrl shift alt其中之一
      if (combKey.length) {
        this.key = this.keyStr = `${combKey.join(' + ')} + ${key}`;
      }
    },
    close() {
      this.$emit('close');
      this.visibleModel = false;
    },
    confirm() {
      ipcRenderer.send('shortcutKey-update', {
        type: this.type,
        key: this.key
      });
      this.$emit('confirm');
      this.visibleModel = false;
    }
  }
};
