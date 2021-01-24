<template>
  <header class="header"></header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

export default defineComponent({
  emits: ['option-click', 'on-close'],
  setup(props, { emit }) {
    props;
    emit;

    const currentRouteName = ref(useRoute().name);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    return {
      currentRouteName
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
