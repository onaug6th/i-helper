<template>
  <div class="home">
    <Header />
    <div class="home-content">
      <div class="home-content__sidebar">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="true"
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
          <el-menu-item index="1">
            <i class="el-icon-edit"></i>
            <template #title>笔记</template>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-copy-document"></i>
            <template #title>剪贴板</template>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-bell"></i>
            <template #title>提醒</template>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-date"></i>
            <template #title>待办事项</template>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-setting"></i>
            <template #title>设置</template>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="home-content__main">
        <router-view v-slot="{ Component }">
          <transition name="main-fade">
            <div class="transition" :key="routeName">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </div>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/header/index.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const isCollapse = ref(true);
    const routeName = ref(useRoute().name);

    return {
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
@import './index.less';
</style>
