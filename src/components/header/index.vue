<template>
  <header class="header">
    <div class="header-left"></div>
    <div class="header-center"></div>
    <div class="header-right">
      <button class="icon flex-center close-window" @click="closeWindow" title="关闭">
        <i class="iconfont flex-center icon-close"></i>
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

export default defineComponent({
  emits: ['option-click', 'close'],
  setup(props, { emit }) {
    props;
    emit;

    const currentRouteName = ref(useRoute().name);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    const closeWindow = () => {
      console.info(123);
    };

    return {
      currentRouteName,
      closeWindow
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
