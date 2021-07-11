<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    //  获取应用信息
    store.dispatch('app/setApp');
    //  获取应用设置
    store.dispatch('app/setSetting');
    //  获取应用快捷键设置
    store.dispatch('app/setShortcutKey');
  }
});
</script>
