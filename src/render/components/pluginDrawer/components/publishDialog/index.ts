/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  name: 'publishDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      desc: ''
    };
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
  methods: {
    close() {
      this.$emit('close');
      this.visibleModel = false;
    },
    confirm() {
      this.$emit('confirm', this.desc);
      this.desc = '';
      this.visibleModel = false;
    }
  }
};
