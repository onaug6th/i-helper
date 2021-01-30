<template>
  <div>
    笔记
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const isCollapse = ref(true);
    const routeName = ref(useRoute().name);

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
