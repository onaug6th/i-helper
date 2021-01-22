<template>
  <Header />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/header.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped></style>
