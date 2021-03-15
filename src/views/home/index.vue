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
          <!-- <el-submenu index="1">
            <template #title>
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
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
import Header from '@/components/header/index.vue';
import appConfig from '@/storage/app';

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
    }> = appConfig.menuList;

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
