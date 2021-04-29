<template>
  <div class="app">
    <Header />
  </div>
</template>

<script lang="ts">
import Header from '@render/components/header/index.vue';
// import { useRoute } from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'plugin',
  components: {
    Header
  },
  setup() {
    // const route = useRoute();
    // const { id, isDev } = route.query;
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
