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

<style>
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
