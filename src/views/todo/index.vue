<template>
  <div>
    <Todo-list />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import TodoList from './components/todoList/index.vue';

export default defineComponent({
  components: {
    TodoList
  },
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
