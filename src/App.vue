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
    //  获取设置应用的窗体id
    store.dispatch('app/setWindowId');
    //  获取应用最新设置
    store.dispatch('app/setNewestSetting');
  }
});
</script>
