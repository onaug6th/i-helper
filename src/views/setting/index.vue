<template>
  <div class="setting">
    <div class="setting-right">
      <Side-nav :data="navData" base="/setting" />
    </div>
    <main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </main>
  </div>
</template>

<script lang="ts">
import SideNav from '@/components/sideNav/index.vue';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    SideNav
  },
  setup() {
    const isCollapse = ref(true);
    const routeName = ref(useRoute().name);
    const navData: Array<{ name?: string; path?: string; href?: string; children?: Array<any>; groups?: any }> = [
      {
        groups: [
          {
            groupName: '设置',
            list: [
              {
                path: '/common',
                title: '通用设置'
              },
              {
                path: '/shortcutKey',
                title: '快捷按键'
              }
            ]
          }
        ]
      }
    ];

    return {
      navData,
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

<style lang="less" scoped>
.setting {
  padding-left: 25px;
  display: flex;
  height: 100vh;
}

.setting-right {
  width: 120px;
  height: 100%;
  border-right: solid 1px #e6e6e6;
}

main {
  padding: 20px;
}
</style>
