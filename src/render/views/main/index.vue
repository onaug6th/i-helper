<template>
  <div class="home" @dragover.prevent="drapOver">
    <div v-show="state.showShade" class="shade" @drop.prevent="drop" @dragleave.prevent="drapLeave"></div>
    <Header />

    <div class="home-content">
      <!-- 左侧侧边栏 -->
      <div class="home-content__sidebar">
        <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="true">
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
import { defineComponent, ref, reactive } from 'vue';
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

    const state: any = reactive({
      //  展示操作遮罩层
      showShade: false
    });

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

    /**
     * 文件放下
     */
    function drop(event) {
      state.showShade = false;

      //  拖拽进来的文件
      const files = Array.prototype.slice.call(event.dataTransfer.files);
      //  网络路径
      const uriList = event.dataTransfer.getData('text/uri-list');
      //  拖拽进来的文字
      const text = event.dataTransfer.getData('text/plain');

      uriList;
      text;
      files;
      debugger;
    }

    /**
     * 拖拽经过
     */
    function drapOver() {
      state.showShade = true;
    }

    /**
     * 拖拽离开
     */
    function drapLeave() {
      state.showShade = false;
    }

    return {
      menuList,
      routeName,
      menuTo,
      state,
      drop,
      drapOver,
      drapLeave
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
