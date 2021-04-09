<template>
  <div class="home">
    <Header />

    <div class="home-content">
      <!-- 左侧侧边栏 -->
      <div class="home-content__sidebar">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :collapse="true"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item
            v-for="(menuItem, menuIndex) in menuList"
            :index="String(menuIndex + 1)"
            :key="menuIndex"
            @click="menuTo(menuItem.path)"
          >
            <i :class="`el-icon-${menuItem.icon}`"></i>
            <template #title>{{ menuItem.label }}</template>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 左侧侧边栏 -->

      <!-- 右侧主体内容 -->
      <div class="home-content__main">
        <el-scrollbar>
          <router-view v-slot="{ Component }">
            <transition name="main-fade">
              <div class="transition" :key="routeName">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </div>
            </transition>
          </router-view>
        </el-scrollbar>
      </div>
      <!-- 右侧主体内容 -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@render/components/header/index.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const routeName = ref(route.name);

    const menuList: Array<{
      label: string;
      path: string;
      icon: string;
    }> = [
      {
        label: '插件',
        path: '/pluginList',
        icon: 'potato-strips'
      },
      {
        label: '开发者',
        path: '/dev',
        icon: 'potato-strips'
      },
      {
        label: '笔记',
        path: '/notes',
        icon: 'edit'
      },
      {
        label: '剪贴板',
        path: '/clipboard',
        icon: 'document'
      },
      {
        label: '提醒',
        path: '/notices',
        icon: 'bell'
      },
      {
        label: '待办事项',
        path: '/todo',
        icon: 'date'
      },
      {
        label: '设置',
        path: '/setting/common',
        icon: 'setting'
      }
    ];

    /**
     * 跳转路由
     */
    function menuTo(path: string) {
      router.push({
        path
      });
    }

    return {
      menuList,
      routeName,
      handleOpen(key: string, keyPath: string) {
        console.log(key, keyPath);
      },
      handleClose(key: string, keyPath: string) {
        console.log(key, keyPath);
      },
      menuTo
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
