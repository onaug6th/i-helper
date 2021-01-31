<template>
  <div>
    剪贴板
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import clipboardObserver from '@/utils/clipboardObserver';

export default defineComponent({
  setup() {
    const isCollapse = ref(true);
    const routeName = ref(useRoute().name);
    clipboardObserver({
      textChange() {
        console.info(arguments);
      },
      imageChange() {
        console.info(arguments);
      }
    });

    return {
      isCollapse,
      routeName,
      handleOpen(key: string, keyPath: string) {
        console.log(key, keyPath);
      },
      handleClose(key: string, keyPath: string) {
        console.log(key, keyPath);
      }
    };
  }
});
</script>

<style lang="less" scoped></style>
