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
import { defineComponent } from 'vue';
import SideNav from '@render/components/sideNav/index.vue';

export default defineComponent({
  components: {
    SideNav
  },
  setup() {
    const navData: Array<any> = [
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
                title: '快捷键'
              }
            ]
          }
        ]
      }
    ];

    return {
      navData
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
