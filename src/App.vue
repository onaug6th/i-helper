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

    ipcRenderer.invoke('get-window-info').then(result => {
      store.dispatch('app/setWindowInfo', result);
    });
  }
});
</script>
