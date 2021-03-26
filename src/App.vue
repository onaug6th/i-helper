<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    //  获取窗体ID
    ipcRenderer.invoke('get-window-id').then(windowId => {
      store.dispatch('app/setWindowId', windowId);
    });

    //  获取应用最新设置
    store.dispatch('app/setNewestSetting');
  }
});
</script>
