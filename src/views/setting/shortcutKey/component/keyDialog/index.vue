<template>
  <el-dialog title="请按下新的快捷键" v-model="visibleModel" width="50%">
    <span>{{ keyStr }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export default {
  props: {
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
      const key = event.key.toUpperCase();

      const ctrlKey = event.ctrlKey ? 'Ctrl' : '';
      const shiftKey = event.shiftKey ? 'Shift' : '';
      const altKey = event.altKey ? 'Alt' : '';

      const combKey = [ctrlKey, shiftKey, altKey].filter(Boolean);
      event.preventDefault();

      //  如没有ctrl shift alt其中之一，或者唯一按下的键为其中之一
      if (!combKey || [16, 17, 18].includes(event.keyCode)) {
        this.keyStr = '无';
      } else {
        this.keyStr = `${combKey.join(' + ')} + ${key}`;
      }
    },
    close() {
      this.$emit('close');
      this.visibleModel = false;
    },
    confirm() {
      this.close();
    }
  }
};
</script>

<style lang="less" scoped></style>
